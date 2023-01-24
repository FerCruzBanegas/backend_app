import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
} from 'graphql';
import moment from 'moment';
import {
	Booking,
	BookingPromoCode,
	SiteSettings,
	Orders,
	OrderItems,
	BookingHistory,
	BookingReviewImage,
	SubCategory,
	User,
	OrderSubCategory,
	OrderCategory,
	Category
} from '../../models';

import BookingRequestType from '../../types/BookingRequestType';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import findNearestPartner from '../../../helpers/findNearestPartner';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { calculateSubTotal } from '../Orders/helper/calculateSubTotal';
import { getPromoCodeData } from '../Orders/helper/getPromoCodeData';
import { calculateBookingPrice } from '../Orders/helper/calculateBookingPrice';
import { checkAllowableServices } from '../Orders/helper/checkAllowableServices';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';

const createBooking = {

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
	},

	async resolve({ request }, { orderId, dropOffLocation, dropOffLat, dropOffLng, requestCurrency, promoId, reviewDescription, paymentType }) {

		try {

			if (request.user && request.user.id) {
				let userId = request.user.id;
				let partnerId, requestLang, dropLocationDetails = {}, subTotal = 0, promoCodeData, bookingId, notes;

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
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

				let subCategoryId = orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map((item) => { return item.subCategoryId });

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

					let allowableDistance = getSiteSettings && getSiteSettings.find((o) => o.name === 'allowableDistace');
					let allowedServices = getSiteSettings && getSiteSettings.find((o) => o.name === 'allowedServices');

					const { serviceStatus, serviceErrorMessage } = await checkAllowableServices(orderId, allowedServices.value);

					if (serviceStatus != 200) {
						await revertProcessingStatus(orderId);
						return await {
							status: serviceStatus,
							errorMessage: serviceErrorMessage
						};
					}

					const nearestPartner = await findNearestPartner(dropLocationDetails.preferredLat, dropLocationDetails.preferredLng, userId, allowableDistance.value, subCategoryId);

					if (nearestPartner && nearestPartner.status === 200 && nearestPartner.result) {

						partnerId = nearestPartner.result.id;

						const partnerProfileData = await getUserProfileData(partnerId, requestProfileParams);

						requestLang = partnerProfileData && partnerProfileData.preferredLanguage;

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

						const { status, errorMessage, subTotalAmount, availableCategory, pricingData } = await calculateSubTotal(orderId, dropLocationDetails, requestCurrency, partnerId);

						if (status != 200) {
							await revertProcessingStatus(orderId);
							return await {
								status,
								errorMessage
							};
						}
						subTotal = subTotalAmount;

						// Calculate Booking Price by the helper
						const { bookingStatus, bookingErrorMessage, priceDetails } = await calculateBookingPrice(availableCategory, subTotal, promoCodeData, dropLocationDetails, requestCurrency, orderId, userId, partnerProfileData);

						if (bookingStatus != 200) {
							await revertProcessingStatus(orderId);
							return await {
								status: bookingStatus,
								errorMessage: bookingErrorMessage
							};
						}

						const createBooking = await Booking.create({
							userId,
							partnerId,
							orderId,
							categoryId: priceDetails.categoryId,
							status: 'created',
							userLocation: userLocationDetails.preferredLocation,
							userLocationLat: userLocationDetails.preferredLat,
							userLocationLng: userLocationDetails.preferredLng,
							startLocation: partnerProfileData.address,
							startLat: partnerProfileData.lat,
							startLng: partnerProfileData.lng,
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
							bookingType: 1
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
								status: 'created',
								bookingId,
								partnerId,
								userId
							});

							const partnerAvailabilityUpdate = await User.update({
								activeStatus: 'active'
							}, {
								where: {
									id: partnerId
								}
							});

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

							let reviewImage = await BookingReviewImage.findAll({
								where: { orderId },
								raw: true
							});

							let jobList = [];
							jobList = await Promise.all(orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map(async (item) => {
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

							const categoryData = await Category.findOne({
								where: { id: priceDetails.categoryId },
								raw: true
							});

							const orderCat = await OrderCategory.create({
								name: categoryData.name,
								orderId,
								description: categoryData.description,
								logoImage: categoryData.logoImage,
								bannerImage: categoryData.bannerImage,
								isJobPhotoRequired: categoryData.isJobPhotoRequired,
							});

							let subCategoryList = jobList.map(function (elem) {
								return (elem.name);
							}).join(", ");

							let content = {
								userId,
								partnerId,
								userDetails: {
									name: userLocationDetails.firstName,
									picture: userLocationDetails.picture,
									phoneNumber: userLocationDetails['user.phoneDialCode'] + '' + userLocationDetails['user.phoneNumber'],
									overallRating: userLocationDetails['user.overallRating'],
								},
								partnerDetails: {
									name: partnerProfileData.firstName,
									picture: partnerProfileData.picture,
									phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
									overallRating: partnerProfileData['user.overallRating'],
								},
								bookingId,
								bookingStatus: createBooking.dataValues.status,
								userLocation: userLocationDetails.preferredLocation,
								userLocationLat: userLocationDetails.preferredLat,
								userLocationLng: userLocationDetails.preferredLng,
								reviewDescription,
								reviewImage,
								estimatedTotalFare: priceDetails.convertPartnerTotalFare,
								jobList,
								status: 'serviceRequest',
								subCategoryList,
								updatedAt: moment().utc().unix()
							};

							sendSocketNotification('serviceRequest-' + partnerId, content);

							sendNotifications({ type: 'serviceRequest', requestContent: content, userId: partnerId, lang: requestLang, userType: 2 });

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
						let content = {
							userId
						};
						await revertProcessingStatus(orderId, 'cancelled', 'processing');
						sendNotifications({ type: 'noProviderFound', requestContent: content, userId, lang: userLocationDetails.preferredLanguage, userType: 1 });
						return {
							status: 401,
							errorMessage: "Sorry, no service providers available for your order. Please try again.",
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
					errorMessage: "Oops! It looks like you are using your account with a different mobile device. Please try again with the recently connected device."
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

export default createBooking;

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
