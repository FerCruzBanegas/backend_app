import {
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLString as StringType
} from 'graphql';

import { Booking, WorkHistory, WorkLogHistory, OrderItems, SubCategory } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

import { getMinutes } from '../../../helpers/timeDuration';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';

const subServiceWork = {

	type: BookingRequestType,

	args: {
		orderItemId: { type: new NonNull(IntType) },
		orderId: { type: new NonNull(IntType) },
		status: { type: StringType },
	},

	async resolve({ request }, { orderItemId, orderId, status }) {

		try {

			let requestLang;

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			// Get the booking data
			const bookingData = await Booking.findOne({
				attributes: ['id', 'status', 'orderId', 'userId', 'partnerId'],
				where: {
					orderId
				},
				raw: true
			});

			if (bookingData) {

				const partnerId = bookingData.partnerId, userId = bookingData.userId;
				const bookingId = bookingData.id;
				let notificationType = '';

				if (status === 'started') notificationType = 'subServiceStarted';
				if (status === 'paused') notificationType = 'subServicePaused';
				if (status === 'resumed') notificationType = 'subServiceResumed';
				if (status === 'completed') notificationType = 'subServiceDone';

				if (bookingData.status === 'started') {

					if (status === 'started' || status === 'resumed') {

						const workLogHistoryUpdate = await WorkLogHistory.create({
							userId: partnerId,
							bookingId,
							orderId,
							orderItemId,
							startedAt: new Date()
						});

						if (status === 'started') {
							const bookingOrderItems = await OrderItems.update({
								startedAt: new Date()
							}, {
								where: {
									id: orderItemId
								}
							});
						}

					} else if (status === 'paused' || status === 'completed') {

						const findHistoryData = await WorkLogHistory.findOne({
							attributes: ['id', 'startedAt', 'status'],
							where: {
								orderItemId,
								orderId,
								bookingId,
								status: null
							},
							raw: true,
						});

						let totalDuration = await getMinutes(findHistoryData.startedAt, new Date());

						const workLogHistoryUpdate = await WorkLogHistory.update({
							status,
							closedAt: new Date(),
							totalDuration
						}, {
							where: {
								id: findHistoryData.id
							}
						});

						if (status === 'completed') {
							const totalWorkedDuration = await WorkLogHistory.sum('totalDuration',
								{
									where: {
										orderItemId,
										orderId,
										bookingId
									},
									raw: true,
								});

							const updateWorkedDuration = await OrderItems.update({
								workedDuration: totalWorkedDuration,
								completedAt: new Date()
							}, {
								where: {
									id: orderItemId,
								}
							});

						}
					}

					// Update the booking status
					const workHistoryUpdate = await WorkHistory.create({
						status,
						orderId,
						orderItemId,
						userId: partnerId,
						bookingId
					});

					let requestProfileParams = ['preferredLanguage', 'preferredCurrency', 'address', 'lat', 'lng',
						'preferredLocation', 'preferredLat', 'preferredLng', 'firstName', 'picture', 'lastName'];

					const userProfileData = await getUserProfileData(userId, requestProfileParams);

					const partnerProfileData = await getUserProfileData(partnerId, requestProfileParams);


					requestLang = userProfileData && userProfileData.preferredLanguage;

					let orders = await OrderItems.findOne({
						attributes: ['subCategoryId'],
						where: {
							id: orderItemId,
						},
						raw: true
					});

					let subCategory = await SubCategory.findOne({
						attributes: ['name'],
						where: {
							id: orders.subCategoryId
						}
					});

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
						status: notificationType,
						subCategory: subCategory.name
					};

					sendNotifications({ type: notificationType, requestContent: content, userId, lang: requestLang, userType: 1 });

					return await {
						status: 200,
						errorMessage: null
					};

				} else {
					return await {
						status: 400,
						errorMessage: 'Oops! Unable to process this service.'
					};
				}

			} else {
				return await {
					status: 400,
					errorMessage: 'Oops! it looks like something went wrong with your service. Please try again.',
				};
			}

		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default subServiceWork;