import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
} from 'graphql';

import {
	Orders, UserProfile
} from '../../models';
import WholeOrdersType from '../../types/Orders/WholeOrdersType';

import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';
import { getPromoCodeData } from '../../mutations/Orders/helper/getPromoCodeData';
import { calculateBookingPrice } from '../../mutations/Orders/helper/calculateBookingPrice';
import { calculateSubTotal } from '../../mutations/Orders/helper/calculateSubTotal';

const getOrder = {

	type: WholeOrdersType,

	args: {
		promoId: { type: IntType },
		requestCurrency: { type: StringType }
	},

	async resolve({ request }, { promoId, requestCurrency }) {
		try {

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			}

			let userId = request.user.id;
			let subTotal = 0, promoCodeData;

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			let result = await Orders.findOne({
				attributes: ['id', 'userId', 'status', 'promoId'],
				where: {
					userId,
					status: 'pending'
				},
				raw: true
			});

			if (!result) {
				return {
					status: 400,
					errorMessage: 'No result found.'
				};
			} else {
				const userLocationDetails = await UserProfile.findOne({
					attributes: ['userId', 'preferredLat', 'preferredLng', 'preferredCurrency'],
					where: {
						userId: {
							$in: [userId]
						}
					},
					raw: true
				});

				// If promo applied
				if (promoId) {
					const { promoData } = await getPromoCodeData(userId, promoId);
					promoCodeData = promoData;
					if (!promoCodeData) {
						return await {
							status: 400,
							errorMessage: `Oops! Coupon does not exist. Please remove or change the coupon.`
						};
					}
				}

				const { status, errorMessage, subTotalAmount, availableCategory } = await calculateSubTotal(result.id, userLocationDetails, requestCurrency);
				if (status != 200) {
					return await {
						status,
						errorMessage
					};
				}
				subTotal = subTotalAmount;

				// Calculate Booking Price by the helper
				const { bookingStatus, bookingErrorMessage, priceDetails } = await calculateBookingPrice(availableCategory, subTotal, promoCodeData, userLocationDetails, requestCurrency, result.id, userId);
				if (bookingStatus != 200) {
					return await {
						status: bookingStatus,
						errorMessage: bookingErrorMessage
					};
				}

				if (priceDetails) {
					result.isSpecialService = priceDetails.isSpecialService;
					result.specialServiceFare = priceDetails.specialServiceFare;
					result.specialServiceTotalFare = priceDetails.specialServiceTotalFare;
					result.subTotal = priceDetails.subTotal;
					result.currency = priceDetails.currency;
					result.userServiceFee = priceDetails.userServiceFee;
					result.total = priceDetails.total;
					result.categoryId = priceDetails.categoryId;
					result.travellingPrice = priceDetails.travellingPrice;
				}

				result.requestCurrency = requestCurrency;
				
				return await {
					status: 200,
					result,
				};
			}

		} catch (err) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + err
			};
		};

	},
};

export default getOrder;