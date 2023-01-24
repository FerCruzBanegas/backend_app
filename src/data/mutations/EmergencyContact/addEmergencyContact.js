import {
	GraphQLString as StringType,
} from 'graphql';
import EmergencyContactListType from '../../types/EmergencyContactListType';
import { EmergencyContact, SiteSettings } from '../../models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const addEmergencyContact = {

	type: EmergencyContactListType,

	args: {
		data: { type: StringType }
	},

	async resolve({ request }, { data }) {

		try {
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				let userId = request.user.id;
				let ContactList = JSON.parse(data);

				let count = await EmergencyContact.count({
					where: {
						userId
					}
				});

				var totalCount = (count && count >= 0) ? parseFloat(count + ContactList.length) : parseFloat(ContactList.length);

				let UpdateList = [];

				let maxCount = await SiteSettings.findOne({
					attributes: ['id', 'value'],
					where: { name: 'maximumEmergencyContact' }
				});

				if (totalCount && totalCount <= (maxCount && Number(maxCount.value) || 5)) {
					UpdateList = await Promise.all(ContactList.map(async (items) => {
						if (items.phoneNumber && items.phoneNumber != '' && items.contactName) {
							return {
								userId,
								phoneNumber: items.phoneNumber,
								contactName: items.contactName
							}
						}
					}));

					if (UpdateList && UpdateList.length > 0) {

						await EmergencyContact.bulkCreate(UpdateList);

						let results = await EmergencyContact.findAll({
							where: {
								userId
							},
							raw: true
						});

						return {
							status: results && results.length > 0 ? 200 : 400,
							results: results && results.length > 0 ? results : [],
							errorMessage: results && results.length > 0 ? null : 'No records found.'
						}
					} else {
						return {
							status: 400,
							errorMessage: 'Oops! The invalid contact list.'
						}
					}
				} else {
					return {
						status: 400,
						errorMessage: `Sorry, up to ${(maxCount && maxCount.value || 5)} contacts only allowed to update. Please try it with mentioned limit of contacts.`
					}
				}
			} else {
				return {
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

export default addEmergencyContact;

/**
mutation addEmergencyContact($data: String!) {
		addEmergencyContact(data: $data) {
				status
				errorMessage
		}
}
{
		"data": "[{\"phoneNumber\":\"1233444\",\"contactName\":\"prbhu\"},{\"phoneNumber\":\"12334445\",\"contactName\":\"prbhu1\"}]"
}
 */
