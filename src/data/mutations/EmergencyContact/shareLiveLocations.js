import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
} from 'graphql';
import each from 'sync-each';
import { EmergencyContact, UserProfile, SiteSettings } from '../../models';
import EmergencyContactType from '../../types/EmergencyContactType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { sendMessage } from '../../../libs/sms/smsMethod';

const shareLiveLocations = {

	type: EmergencyContactType,

	args: {
		partnerName: { type: new NonNull(StringType) },
		currentLocation: { type: new NonNull(StringType) },
		bookingId: { type: new NonNull(IntType) }
	},

	async resolve({ request }, { partnerName, currentLocation, bookingId }) {
		try {

			let status = 200, errorMessage;
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				let userId = request.user.id;

				let contactList = await EmergencyContact.findAll({
					attributes: ['phoneNumber'],
					where: {
						userId
					},
					limit: 5,
					raw: true
				});

				let userData = await UserProfile.findOne({
					attributes: ['firstName', 'lastName'],
					where: {
						userId
					},
					raw: true
				});

				const getSiteSettings = await SiteSettings.findOne({
					attributes: ['name', 'value'],
					where: {
						name: 'siteName'
					},
					raw: true
				});

				let firstName = (userData && userData.firstName) ? userData.firstName : '';
				let message = `Emergency! ${firstName} is with ${partnerName} at ${currentLocation} for job request #${bookingId} on ${getSiteSettings.value}!`;
				if (contactList && contactList.length > 0) {
					each(contactList, async function (items, next) {
						try {
							const { smsStatus, smsError } = await sendMessage({ message, to: items.phoneNumber });
						} catch (error) {
							next()
						}
					}, function (err, transformedItems) {
						status = 200;
					});
				} else {
					status = 400;
					errorMessage = 'Oops! Your contact list is empty. Please add a contact.';
				}
			} else {
				status = 500;
				errorMessage = 'Oops! it looks like you are not logged-in with your account. Please login to continue.';
			}

			return await {
				status,
				errorMessage
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + error
			}
		}
	},
};

export default shareLiveLocations;

/**
mutation shareLiveLocations($partnerName: String, $vecihleNumber: String,$currentLocation: String) {
		shareLiveLocations(partnerName: $partnerName, vecihleNumber: $vecihleNumber, currentLocation:$currentLocation) {
				status
				errorMessage
		}
}
 */
