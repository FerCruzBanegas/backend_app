
import {
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType
} from 'graphql';

import { Booking, BookingHistory } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const startBooking = {

	type: BookingRequestType,

	args: {
		bookingId: { type: new NonNull(IntType) },
	},

	async resolve({ request }, { bookingId }) {
		let pushNotificationContent, requestLang, errorMessage;
		try {
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				const bookingData = await Booking.findOne({
					attributes: ['id', 'status', 'partnerId', 'userId'],
					where: {
						id: bookingId
					},
					raw: true
				});

				if (bookingData && bookingData.status === 'reviewed') {

					let userId = bookingData.userId;
					let partnerId = bookingData.partnerId;

					// Update booking history status for the arrived partner
					const bookingHistoryUpdate = await BookingHistory.create({
						status: 'started',
						bookingId,
						partnerId,
						userId
					});

					// Update the booking status to "arrived"
					const bookingUpdate = await Booking.update({
						status: 'started'
					}, {
						where: {
							id: bookingId
						}
					});

					let requestProfileParams = ['preferredLanguage', 'preferredCurrency', 'address', 'lat', 'lng',
						'preferredLocation', 'preferredLat', 'preferredLng', 'firstName', 'picture', 'lastName'];

					const userProfileData = await getUserProfileData(userId, requestProfileParams);

					const partnerProfileData = await getUserProfileData(partnerId, requestProfileParams);


					requestLang = userProfileData && userProfileData.preferredLanguage;

					let content = {
						userId,
						partnerId,
						userDetails: {
							name: userProfileData.firstName,
							picture: userProfileData.picture,
							phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
							overallRating: userProfileData['user.overallRating'],
						},
						partnerDetails: {
							name: partnerProfileData.firstName,
							picture: partnerProfileData.picture,
							phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
							overallRating: partnerProfileData['user.overallRating'],
						},
						bookingId,
						bookingStatus: 'started'
					};

					sendSocketNotification('serviceStarted-' + bookingData.id, content);
					sendNotifications({ type: 'serviceStarted', requestContent: content, userId, lang: requestLang, userType: 1 });

					return await {
						status: 200,
						errorMessage: null,
						result: {
							userId,
							partnerId,
							bookingId,
							status: 'started',
						}
					};

				} else {
					errorMessage = 'Oops! Unable to review this service. It looks like this service is already ';

					if (bookingData && bookingData.status === 'started') {
						errorMessage = errorMessage + 'started';
					} else if (bookingData && bookingData.status === 'cancelledByUser') {
						errorMessage = errorMessage + 'canceled by the user.';
					} else if (bookingData && bookingData.status === 'cancelledByPartner') {
						errorMessage = errorMessage + 'canceled by you or other partner.';
					} else {
						errorMessage = errorMessage + 'completed.';
					}

					return {
						status: 400,
						errorMessage
					};
				}
			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				}
			}
		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default startBooking;