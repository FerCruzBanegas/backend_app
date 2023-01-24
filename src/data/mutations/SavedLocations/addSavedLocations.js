import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql'; import { User, SavedLocations } from '../../models';

import SavedLocationsType from '../../types/SavedLocationsType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const addSavedLocations = {

    type: SavedLocationsType,

    args: {
        id: { type: IntType },
        location: { type: new NonNull(StringType) },
        lat: { type: new NonNull(FloatType) },
        lng: { type: new NonNull(FloatType) },
        locationType: { type: new NonNull(StringType) },
        locationName: { type: StringType }
    },

    async resolve({ request }, {
        id,
        location,
        lat,
        lng,
        locationType,
        locationName
    }) {
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let userId = request.user.id;

                if (id) { // Update
                    const updateSavedLocations = await SavedLocations.update({
                        location,
                        lat,
                        lng,
                        locationType,
                        locationName
                    }, {
                        where: {
                            userId,
                            id
                        }
                    });

                    return await {
                        id,
                        status: updateSavedLocations ? 200 : 400,
                        errorMessage: updateSavedLocations ? null : 'Oops! unable to save the location. Please try again'
                    };

                } else { // Create
                    const createSavedLocations = await SavedLocations.create({
                        userId,
                        location,
                        lat,
                        lng,
                        locationType,
                        locationName
                    });

                    return await {
                        id: createSavedLocations ? createSavedLocations.dataValues.id : null,
                        status: createSavedLocations ? 200 : 400,
                        errorMessage: createSavedLocations ? null : 'Oops! unable to save the location. Please try again'
                    };
                }

            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong! ' + error.message

            }
        }
    },
};

export default addSavedLocations;

/*
        
mutation($id: Int, $location: String!, $lat: Float!, $lng: Float!, $locationType: String!, $locationName: String) {
    addSavedLocations(id: $id, location: $location, lat: $lat, lng: $lng, locationType: $locationType, locationName: $locationName) {
        status
        errorMessage
    }
}

*/
