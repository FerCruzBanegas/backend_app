import {
	GraphQLInt as IntType
} from 'graphql';
import { User, SavedLocations, UserProfile } from '../../models';
import SavedLocationsType from '../../types/SavedLocationsType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const removeSavedLocations = {

	type: SavedLocationsType,

	args: {
		id: { type: IntType }
	},

	async resolve({ request }, {
		id
	}) {
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

				const getType = await SavedLocations.findOne({
					attributes: ['locationType', 'locationName'],
					where: {
						userId,
						id
					},
					raw: true
				});

				const checkPreferredType = await UserProfile.findOne({
					attributes: ['preferredType'],
					where: {
						userId,
					},
					raw: true
				});

				const deleteSavedLocations = await SavedLocations.destroy({
					where: {
						userId,
						id
					}
				});

				if (checkPreferredType.preferredType == getType.locationType || checkPreferredType.preferredType == getType.locationName) {
					await UserProfile.update(
						{
							preferredType: null
						},
						{ where: { userId } }
					);
				}

				return await {
					status: deleteSavedLocations ? 200 : 400,
					errorMessage: deleteSavedLocations ? null : 'Oops! unable to remove the location. Please try again'
				};

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

export default removeSavedLocations;

/*
			  
mutation($id: Int) {
		removeSavedLocations(id: $id) {
				status
				errorMessage
		}
}

*/
