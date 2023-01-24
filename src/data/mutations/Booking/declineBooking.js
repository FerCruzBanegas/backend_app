import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
} from 'graphql';
import moment from 'moment';
import {
	Booking,
	BookingHistory,
	User,
	SiteSettings,
	OrderItems,
	BookingReviewImage,
	SubCategory,
	Orders
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import findNearestPartner from '../../../helpers/findNearestPartner';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import declineOtherBookings from './helper/declineOtherBookings';

const declineBooking = {

	type: BookingRequestType,

	args: {
		requestStatus: { type: new NonNull(StringType) },
		bookingId: { type: new NonNull(IntType) }
	},

	async resolve({ request }, { requestStatus, bookingId }) {
		let categoryId, nextpartnerId, userId;
		let bookingData;
		let errorMessage, requestLang;
		let userLocationLat, userLocationLng, userLocation;

		try {
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				if (requestStatus && bookingId) {
					// Get Booking Data
					bookingData = await Booking.findOne({
						where: {
							id: bookingId
						},
						raw: true
					})

					userLocationLat = bookingData.userLocationLat;
					userLocationLng = bookingData.userLocationLng;
					userLocation = bookingData.userLocation;
					categoryId = bookingData.categoryId;
					nextpartnerId = bookingData.partnerId;
					userId = bookingData.userId;

					if (bookingData && bookingData.status === 'created') {

						let requestProfileParams = ['preferredLanguage', 'preferredCurrency', 'address', 'lat', 'lng',
							'preferredLocation', 'preferredLat', 'preferredLng', 'firstName', 'picture', 'lastName'];

						const userProfileData = await getUserProfileData(userId, requestProfileParams);

						let partnerProfileData = await getUserProfileData(nextpartnerId, requestProfileParams);

						// Update Booking History for Partner Decline history
						const bookingHistoryUpdate = await BookingHistory.create({
							status: 'declined',
							bookingId,
							partnerId: nextpartnerId,
							userId
						});

						// Enable the declined partner availability for another booking
						const partnerAvailabilityUpdate = await User.update({
							activeStatus: 'inactive'
						}, {
							where: {
								id: nextpartnerId
							}
						});

						const getSiteSettings = await SiteSettings.findOne({
							attributes: ['name', 'value'],
							where: {
								name: 'allowableDistace'
							},
							raw: true
						});

						let orderItemDetails = await OrderItems.findAll({
							attributes: ['subCategoryId', 'totalQuantity'],
							where: {
								orderId: bookingData.orderId,
							},
							raw: true
						});

						let subCategoryId = orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map((item) => { return item.subCategoryId });

						const nearestPartner = await findNearestPartner(userLocationLat, userLocationLng, userId, getSiteSettings.value, subCategoryId);

						if (nearestPartner && nearestPartner.status === 200 && nearestPartner.result) {

							nextpartnerId = nearestPartner.result.id;

							partnerProfileData = await getUserProfileData(nextpartnerId, requestProfileParams);

							requestLang = partnerProfileData && partnerProfileData.preferredLanguage;

							// Update the booking with new Partner
							const updateBooking = await Booking.update({
								partnerId: nextpartnerId
							}, {
								where: {
									id: bookingId
								}
							});

							// Create Booking History for New Partner
							const createBookingHistory = await BookingHistory.create({
								bookingId,
								userId,
								partnerId: nextpartnerId,
								status: 'approved'
							});

							// Disable the chosen partner availability for another trip
							const partnerStatusUpdate = await User.update({
								activeStatus: 'active'
							}, {
								where: {
									id: nextpartnerId
								}
							});

							let reviewImage = await BookingReviewImage.findAll({
								where: { orderId: bookingData.orderId },
								raw: true
							});

							let jobList = [];
							jobList = await Promise.all(orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map(async (item) => {
								let data = await SubCategory.findOne({
									attributes: ['name'],
									where: {
										id: item.subCategoryId
									}
								});

								return {
									totalQuantity: item.totalQuantity,
									name: data.name
								}
							}));

							let content = {
								userId,
								partnerId: nextpartnerId,
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
								userLocation: bookingData.userLocation,
								userLocationLat: bookingData.userLocationLat,
								userLocationLng: bookingData.userLocationLng,
								reviewDescription: bookingData.reviewDescription,
								reviewImage,
								estimatedTotalFare: bookingData.estimatedTotalFare,
								jobList,
								bookingStatus: 'created',
								updatedAt: moment().utc().unix()
							};

							sendSocketNotification('serviceRequest-' + nextpartnerId, content);

							sendNotifications({ type: 'serviceRequest', requestContent: content, userId: nextpartnerId, lang: requestLang, userType: 2 });
							
							declineOtherBookings(bookingData.partnerId, bookingId);

							return await {
								status: 200,
								errorMessage: null,
								result: {
									userId,
									partnerId: nextpartnerId,
									bookingId,
								}
							};

						} else {
							// Update Booking to Expired
							const findPendingPartners = await Booking.findAll({
								attributes: ['partnerId'],
								where: {
									id: bookingId
								},
								raw: true
							});

							const pendingPartnerIds = findPendingPartners && findPendingPartners.map(o => o.partnerId);

							if (pendingPartnerIds && pendingPartnerIds.length > 0) {

								const updatePendingPartnerStatus = await User.update({
									activeStatus: 'inactive'
								}, {
									where: {
										id: {
											$in: pendingPartnerIds
										}
									}
								});
							}

							const updateBookingToExpired = await Booking.update({
								status: 'expired',
								notes: 'Decline - No partners found.'
							}, {
								where: {
									id: bookingId
								}
							});

							const cancelOrder = await Orders.update({
								status: 'cancelled'
							}, {
								where: {
									id: bookingData.orderId
								}
							});

							let content = {
								userId,
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
								bookingStatus: 'declined'
							};

							requestLang = userProfileData && userProfileData.preferredLanguage;

							sendSocketNotification('serviceDeclined-' + bookingId, content);
							sendNotifications({ type: 'serviceDeclined', requestContent: content, userId, lang: requestLang, userType: 1 });

							declineOtherBookings(bookingData.partnerId, bookingId);

							return await {
								status: 200
							};

						}
					} else {
						errorMessage = 'Oops! Unable to decline this service. It looks like this service is already ';

						if (bookingData && bookingData.status === 'approved') {
							errorMessage = errorMessage + 'accepted.';
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
						status: 400,
						errorMessage: 'Oops! Something went wrong! Please try again.',
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

export default declineBooking;