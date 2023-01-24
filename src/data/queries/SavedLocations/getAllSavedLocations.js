import {
    User,
    SavedLocations
} from '../../models';

import SavedLocationsCommonType from '../../types/SavedLocationsCommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';


const getAllSavedLocations = {

    type: SavedLocationsCommonType,

    async resolve({ request }) {
        try {
            if (request.user) {
                let userId = request.user.id;

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let results = await SavedLocations.findAll({
                    where: {
                        userId
                    }
                });

                return await {
                    results: results && results.length > 0 ? results : [],
                    status: 200,
                    errorMessage: results && results.length > 0 ? null : 'No records found.'
                };

            } else {
                return await {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }

    },
};

export default getAllSavedLocations;

/**
query {
  getAllSavedLocations {
    result {
        id
        userId
        location
        lat
        lng
        locationType
        locationName
    }
    status
    errorMessage
  }
}

 */
