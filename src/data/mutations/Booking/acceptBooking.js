
import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
} from 'graphql';

import { Booking, BookingHistory } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import declineOtherBookings from './helper/declineOtherBookings';

const acceptBooking = {

	type: BookingRequestType,

	args: {
		bookingId: { type: new NonNull(IntType) },
		startLat: { type: new NonNull(FloatType) },
		startLng: { type: new NonNull(FloatType) },
		startLocation: { type: new NonNull(StringType) }
	},

	async resolve({ request }, { bookingId, startLat, startLng, startLocation }) {
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

				let partnerId = bookingData.partnerId, userId = bookingData.userId;

				if (bookingData && bookingData.status === 'created') {
					// Update booking history status for the accepted driver
					const bookingHistoryUpdate = await BookingHistory.create({
						status: 'approved',
						bookingId,
						partnerId,
						userId
					});

					// Update the booking status to "approved"
					const bookingUpdate = await Booking.update({
						status: 'approved',
						startLat,
						startLng,
						startLocation
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
						bookingStatus: 'approved',
						status: 'serviceAccepted'
					};

					sendSocketNotification('serviceAccepted-' + bookingId, content);

					sendNotifications({ type: 'serviceAccepted', requestContent: content, userId, lang: requestLang, userType: 1 });

					// decline other bookings

					declineOtherBookings(partnerId, bookingId);

					return await {
						status: 200,
						errorMessage: null,
						result: {
							userId,
							partnerId,
							bookingId,
							status: 'approved',
						}
					};
				} else {
					errorMessage = 'Oops! Unable to accept this service. It looks like this service is already ';

					if (bookingData && bookingData.status === 'approved') {
						errorMessage = errorMessage + 'accepted.';
					} else if (bookingData && bookingData.status === 'declined') {
						errorMessage = errorMessage + 'declined.';
					} else if (bookingData && bookingData.status === 'started') {
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

export default acceptBooking;