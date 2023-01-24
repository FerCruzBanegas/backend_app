import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType,
	GraphQLInt as IntType
} from 'graphql';
import moment from 'moment';
import {
	Booking,
	Orders,
	OrderItems,
	SiteSettings,
	SubCategory,
	BookingPromoCode,
	OrderSubCategory,
	BookingHistory
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import {
	createScheduleBookingData,
	createScheduleBookingHistory,
	checkScheduleBookingDuration,
} from '../../../helpers/booking/scheduleBookingHelpers';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { calculateSubTotal } from '../Orders/helper/calculateSubTotal';
import { getPromoCodeData } from '../Orders/helper/getPromoCodeData';
import { calculateBookingPrice } from '../Orders/helper/calculateBookingPrice';
import { checkAllowableServices } from '../Orders/helper/checkAllowableServices';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';

const createScheduleBooking = {

	type: BookingRequestType,

	args: {
		orderId: { type: new NonNull(IntType) },
		dropOffLocation: { type: StringType },
		dropOffLat: { type: FloatType },
		dropOffLng: { type: FloatType },
		requestCurrency: { type: StringType },
		promoId: { type: IntType },
		reviewDescription: { type: StringType },
		paymentType: { type: IntType },
		scheduleFrom: { type: new NonNull(IntType) },
		scheduleTo: { type: new NonNull(IntType) },
	},

	async resolve({ request }, {
		orderId, dropOffLocation, dropOffLat, dropOffLng, requestCurrency, promoId, reviewDescription, paymentType, scheduleFrom, scheduleTo
	}) {
		try {
			let formattedScheduleFrom, formattedScheduleTo;
			let userId = request.user.id;
			let dropLocationDetails = {}, subTotal = 0, promoCodeData, bookingId, notes;

			if (request && request.user) {
				userId = request.user.id; // Current logged-in user ID

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				if (scheduleFrom) {
					formattedScheduleFrom = moment.unix(scheduleFrom).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
					formattedScheduleTo = moment.unix(scheduleTo).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
				}

				const { status: eligibleStatus, errorMessage: eligibleErrorMessage } = await checkScheduleBookingDuration(formattedScheduleFrom);
				if (eligibleStatus !== 200) {
					return {
						status: eligibleStatus,
						errorMessage: eligibleErrorMessage
					};
				}


				let orderDetails = await Orders.findOne({
					attributes: ['userId'],
					where: {
						id: orderId,
						status: 'pending'
					},
					raw: true
				});

				let orderItemDetails = await OrderItems.findAll({
					attributes: ['subCategoryId', 'totalQuantity'],
					where: {
						orderId,
					},
					raw: true
				});

				if (orderDetails) {

					const bookingData = await Booking.findOne({
						attributes: ['id'],
						where: {
							orderId
						},
						raw: true
					});

					if (bookingData) {
						return await {
							status: 400,
							errorMessage: 'Oops! Something went wrong. Please try again.'
						};
					}

					let orderStatus = await revertProcessingStatus(orderId, 'processing', 'pending');
					if (!orderStatus) {
						return await {
							status: 400,
							errorMessage: 'Oops! Something went wrong. Please try again.'
						};
					}

					let requestProfileParams = ['preferredLanguage', 'preferredCurrency', 'address', 'lat', 'lng',
						'preferredLocation', 'preferredLat', 'preferredLng', 'firstName', 'picture', 'lastName'];

					const userLocationDetails = await getUserProfileData(userId, requestProfileParams);

					if (dropOffLocation) {
						dropLocationDetails = {
							preferredLocation: dropOffLocation,
							preferredLat: dropOffLat,
							preferredLng: dropOffLng,
							preferredLanguage: userLocationDetails.preferredLanguage,
							preferredCurrency: userLocationDetails.preferredCurrency
						};
					} else {
						dropLocationDetails = Object.assign({}, dropLocationDetails, userLocationDetails);
					}

					if (!dropLocationDetails || (dropLocationDetails && !dropLocationDetails.preferredLocation)) {
						await revertProcessingStatus(orderId);
						return await {
							status: 400,
							errorMessage: 'Oops! Please provide the delivery location to place your order.'
						};
					}

					const getSiteSettings = await SiteSettings.findAll({
						attributes: ['name', 'value'],
						where: {
							name: {
								$in: ['allowableDistace', 'allowedServices']
							}
						},
						raw: true
					});

					let allowedServices = getSiteSettings && getSiteSettings.find((o) => o.name === 'allowedServices');

					const { serviceStatus, serviceErrorMessage } = await checkAllowableServices(orderId, allowedServices.value);

					if (serviceStatus != 200) {
						await revertProcessingStatus(orderId);
						return await {
							status: serviceStatus,
							errorMessage: serviceErrorMessage
						};
					}

					// Find the the valid promo code information if Promo code applied
					if (promoId) {
						const { promoData } = await getPromoCodeData(userId, promoId);
						promoCodeData = promoData;
						if (!promoCodeData) {
							await revertProcessingStatus(orderId);
							return await {
								status: 400,
								errorMessage: `Oops! Coupon does not exist. Please remove or change the coupon.`
							};
						}
					}

					const { status, errorMessage, subTotalAmount, availableCategory, pricingData } = await calculateSubTotal(orderId, dropLocationDetails, requestCurrency);

					if (status != 200) {
						await revertProcessingStatus(orderId);
						return await {
							status,
							errorMessage
						};
					}
					subTotal = subTotalAmount;

					// Calculate Booking Price by the helper
					const { bookingStatus, bookingErrorMessage, priceDetails } = await calculateBookingPrice(availableCategory, subTotal, promoCodeData, dropLocationDetails, requestCurrency, orderId, userId);

					if (bookingStatus != 200) {
						await revertProcessingStatus(orderId);
						return await {
							status: bookingStatus,
							errorMessage: bookingErrorMessage
						};
					}

					const createBooking = await Booking.create({
						userId,
						partnerId: null,
						orderId,
						categoryId: priceDetails.categoryId,
						status: 'scheduled',
						userLocation: userLocationDetails.preferredLocation,
						userLocationLat: userLocationDetails.preferredLat,
						userLocationLng: userLocationDetails.preferredLng,
						startLocation: userLocationDetails.address,
						startLat: userLocationDetails.lat,
						startLng: userLocationDetails.lng,
						endLocation: userLocationDetails.preferredLocation,
						endLat: userLocationDetails.preferredLat,
						endLng: userLocationDetails.preferredLng,
						currency: priceDetails.currency,
						pricingType: priceDetails.pricingType,
						discountAmount: priceDetails.specialServiceFare,
						specialBookingFare: priceDetails.specialServiceTotalFare,
						estimatedTotalFare: priceDetails.total,
						totalFare: priceDetails.total,
						userServiceFeeType: priceDetails.userServiceFeeType,
						userServiceFeeValue: priceDetails.userServiceFeeValue,
						partnerServiceFeeType: priceDetails.partnerServiceFeeType,
						partnerServiceFeeValue: priceDetails.partnerServiceFeeValue,
						userServiceFee: priceDetails.userServiceFee,
						partnerServiceFee: priceDetails.partnerServiceFee,
						userTotalFare: priceDetails.userTotalFare,
						partnerTotalFare: priceDetails.partnerTotalFare,
						reviewDescription,
						notes,
						travellingPrice: priceDetails.travellingPrice,
						paymentType,
						userPayableFare: priceDetails.userPayableFare,
						bookingType: 2
					});

					if (pricingData && pricingData.length > 0) {
						pricingData.map(async (data) => {
							let updateOrderItems = OrderItems.update({
								baseFare: data.baseFare,
								pricingId: data.pricingId
							}, {
								where: {
									orderId: data.orderId,
									categoryId: data.categoryId,
									subCategoryId: data.subCategoryId,
									currency: requestCurrency
								}
							});
						});
					}

					if (createBooking) {
						bookingId = createBooking.dataValues.id;

						// Update booking history status for the  partner
						const bookingHistoryUpdate = await BookingHistory.create({
							status: 'scheduled',
							bookingId,
							userId
						});

						const scheduleId = await createScheduleBookingData(bookingId, userId, formattedScheduleFrom, formattedScheduleTo);
						await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'scheduled');

						// If PromoCode valid
						if (promoCodeData && promoCodeData.id) {
							const createBookingPromoCode = await BookingPromoCode.create({
								promoId: promoCodeData.id,
								bookingId,
								title: promoCodeData.title,
								code: promoCodeData.code,
								type: promoCodeData.type,
								promoValue: promoCodeData.promoValue,
								currency: promoCodeData.currency,
								expiryDate: promoCodeData.expiryDate
							});
						}

						await Promise.all(orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map(async (item) => {
							let data = await SubCategory.findOne({
								where: {
									id: item.subCategoryId
								}
							});

							const orderSubCat = await OrderSubCategory.create({
								status: 'active',
								name: data.name,
								categoryId: data.categoryId,
								orderId,
								subCategoryId: data.id,
								description: data.description,
								image: data.image
							});

							return {
								totalQuantity: item.totalQuantity,
								name: data.name
							}
						}));

						return {
							status: 200,
							result: createBooking && createBooking.dataValues
						}

					} else {
						await revertProcessingStatus(orderId);
						return await {
							status: 400,
							result: {
								orderItemDetails: orderItems
							},
							errorMessage: 'Oops! Something went wrong!  Please try again'
						}
					}


				} else {
					await revertProcessingStatus(orderId);
					return {
						status: 400,
						errorMessage: 'Oops! Order does not exist.'
					}
				}

			} else {
				return {
					status: 500,
					errorMessage: 'Oops! Please login with your account and try again.',
				};
			}
		} catch (error) {
			return {
				errorMessage: 'Something went wrongss' + error,
				status: 400
			};
		}
	}
};

export default createScheduleBooking;

async function revertProcessingStatus(orderId, updateStatus, whereStatus) {
	let updateOrderStatus = await Orders.update({
		status: updateStatus ? updateStatus : 'pending'
	}, {
		where: {
			id: orderId,
			status: whereStatus ? whereStatus : 'processing'
		}
	});
	if (updateOrderStatus && updateOrderStatus[0] > 0) return true;
}