import {
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
} from 'graphql';
import { EmergencyContact } from '../../models';
import EmergencyContactType from '../../types/EmergencyContactType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const deleteEmergencyContact = {

	type: EmergencyContactType,

	args: {
		contactId: { type: new NonNull(IntType) }
	},

	async resolve({ request }, { contactId }) {
		try {
			if (request.user && request.user.id && contactId) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				let userId = request.user.id;

				const deleteContact = await EmergencyContact.destroy({
					where: {
						id: contactId,
						userId
					}
				});

				return await {
					status: deleteContact ? 200 : 400,
					errorMessage: deleteContact ? null : 'Oops! unable to remove the contact. Please try again.'
				}

			} else {
				return await {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'

				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + error
			}
		}
	},
};

export default deleteEmergencyContact;

/**
mutation deleteEmergencyContact($contactId: Int!) {
		deleteEmergencyContact(contactId: $contactId) {
				status
				errorMessage
		}
}
 */
