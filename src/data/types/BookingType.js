import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
	GraphQLBoolean as BooleanType,
	GraphQLList as List,
} from 'graphql';

import {
	UserProfile,
	Category,
	Reviews,
	OrderItems,
	BookingReviewImage,
	ScheduleBooking
} from '../models';

import ProfileType from './ProfileType';
import GetCategoryType from './GetCategoryType';
import OrderItemsType from './Orders/OrderItemsType';
import BookingReviewImageType from './Orders/BookingReviewImageType';
import ScheduleBookingType from './scheduleBooking/ScheduleBookingType';

import { getCurrencyRates } from '../../helpers/booking/commonHelpers'
import { convert } from '../../helpers/currencyConvertion';
import { websiteUrl } from '../../config';

const BookingType = new ObjectType({
	name: 'BookingType',
	fields: {
		id: {
			type: IntType,
		},
		userId: {
			type: StringType,
		},
		partnerId: {
			type: StringType
		},
		orderId: {
			type: IntType,
		},
		categoryId: {
			type: IntType,
		},
		status: {
			type: StringType
		},
		userLocation: {
			type: StringType
		},
		userLocationLat: {
			type: FloatType
		},
		userLocationLng: {
			type: FloatType
		},
		startLocation: {
			type: StringType
		},
		startLat: {
			type: FloatType
		},
		startLng: {
			type: FloatType
		},
		startedAt: {
			type: StringType
		},
		endLocation: {
			type: StringType
		},
		endLat: {
			type: FloatType
		},
		endLng: {
			type: FloatType
		},
		completedAt: {
			type: StringType
		},
		currency: {
			type: StringType
		},
		requestCurrency: {
			type: StringType
		},
		pricingType: {
			type: StringType
		},
		travellingPrice: {
			type: FloatType
		},
		discountAmount: {
			type: FloatType
		},
		specialBookingFare: {
			type: FloatType
		},
		totalRideDistance: {
			type: FloatType
		},
		estimatedTotalFare: {
			type: FloatType
		},
		totalFare: {
			type: FloatType
		},
		createdAt: {
			type: StringType
		},
		updatedAt: {
			type: StringType
		},
		convertEstimatedTotalFare: {
			type: FloatType,
			async resolve(data) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertEstimatedTotalFare = data.estimatedTotalFare;
				if (data.requestCurrency !== data.currency) {
					convertEstimatedTotalFare = convert(baseCurrency.currencyCode, rates, data.estimatedTotalFare, data.currency, data.requestCurrency);
				}
				return convertEstimatedTotalFare;
			}
		},
		convertTotalFare: {
			type: FloatType,
			async resolve(data) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertTotalFare = data.totalFare;
				if (data.requestCurrency !== data.currency) {
					convertTotalFare = convert(baseCurrency.currencyCode, rates, data.totalFare, data.currency, data.requestCurrency);
				}
				return convertTotalFare;
			}
		},
		convertUserTotalFare: {
			type: FloatType,
			async resolve(data) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertUserTotalFare = data.userTotalFare;
				if (data.requestCurrency !== data.currency) {
					convertUserTotalFare = convert(baseCurrency.currencyCode, rates, data.userTotalFare, data.currency, data.requestCurrency);
				}
				return convertUserTotalFare;
			}
		},
		convertPartnerTotalFare: {
			type: FloatType,
			async resolve(data) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertPartnerTotalFare = data.partnerTotalFare;
				if (data.requestCurrency !== data.currency) {
					convertPartnerTotalFare = convert(baseCurrency.currencyCode, rates, data.partnerTotalFare, data.currency, data.requestCurrency);
				}
				return convertPartnerTotalFare;
			}
		},
		additionalFee: {
			type: FloatType
		},
		userServiceFeeType: {
			type: StringType
		},
		userServiceFeeValue: {
			type: FloatType
		},
		partnerServiceFeeType: {
			type: StringType
		},
		partnerServiceFeeValue: {
			type: FloatType
		},
		userServiceFee: {
			type: FloatType
		},
		partnerServiceFee: {
			type: FloatType
		},
		userTotalFare: {
			type: FloatType
		},
		partnerTotalFare: {
			type: FloatType
		},
		paymentStatus: {
			type: StringType
		},
		paymentType: {
			type: IntType
		},
		transactionId: {
			type: StringType
		},
		isBanStatus: {
			type: BooleanType
		},
		isPayoutPaid: {
			type: BooleanType
		},
		reviewDescription: {
			type: StringType
		},
		additionalDescription: {
			type: StringType
		},
		tipsAmount: {
			type: FloatType
		},
		notes: {
			type: StringType
		},
		promoCodeId: {
			type: IntType
		},
		isSpecialService: {
			type: BooleanType
		},
		specialServiceFare: {
			type: FloatType
		},
		specialServiceTotalFare: {
			type: FloatType
		},
		isTipGiven: {
			type: BooleanType
		},
		tipsAmount: {
			type: FloatType
		},
		tipsTotalFare: {
			type: FloatType
		},
		tipsPartnerTotalFare: {
			type: FloatType,
			async resolve(booking) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let fare = booking.tipsPartnerTotalFare || 0;
				if (booking.requestCurrency !== booking.currency) {
					fare = convert(baseCurrency.currencyCode, rates, booking.tipsPartnerTotalFare, booking.currency, booking.requestCurrency);
				}
				return await fare;
			},
		},
		partnerDetails: {
			type: ProfileType,
			resolve(booking) {
				return UserProfile.findOne({
					where: { userId: booking.partnerId },
				});
			},
		},
		userDetails: {
			type: ProfileType,
			async resolve(booking) {
				return await UserProfile.findOne({
					where: { userId: booking.userId },
				});
			},
		},
		categoryDetails: {
			type: GetCategoryType,
			async resolve(booking) {
				let data = await Category.findOne({
					where: { id: booking.categoryId },
				});

				data.requestCurrency = booking.requestCurrency;
				return data;
			},
		},
		orderItemsList: {
			type: new List(OrderItemsType),

			async resolve(booking) {
				let data = await OrderItems.findAll({
					where: { orderId: booking.orderId }
				});

				if (data && data.length > 0) {
					await Promise.all(
						data.map((item, key) => {
							item.requestCurrency = booking.requestCurrency;
						})
					);
				}

				return data;
			}
		},
		userPayableFare: {
			type: FloatType,
			async resolve(booking) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let fare = booking.userPayableFare || 0;
				if (booking.requestCurrency !== booking.currency) {
					fare = convert(baseCurrency.currencyCode, rates, booking.userPayableFare, booking.currency, booking.requestCurrency);
				}
				return fare;
			}
		},
		isUserReviewed: {
			type: BooleanType,
			async resolve(booking) {
				return await Reviews.count({
					where: {
						bookingId: booking.id,
						authorId: booking.userId
					}
				}) || false;
			}
		},
		isPartnerReviewed: {
			type: BooleanType,
			async resolve(booking) {
				return await Reviews.count({
					where: {
						bookingId: booking.id,
						authorId: booking.partnerId
					}
				}) || false;
			}
		},
		reviewImage: {
			type: new List(BookingReviewImageType),
			async resolve(booking) {
				return await BookingReviewImage.findAll({
					where: { orderId: booking.orderId },
				});
			},
		},
		pdfURL: {
			type: StringType,
			async resolve(booking) {
				return (websiteUrl + '/download-pdf?orderId=' + booking.orderId)
			},
		},
		bookingType: {
			type: IntType
		},
		scheduleBookingDetails: {
			type: ScheduleBookingType,
			async resolve(booking) {
				if (booking && booking.bookingType === 2) { // Schedule Booking
					return await ScheduleBooking.findOne({
						attributes: ['id', 'bookingId', 'status', 'scheduleFrom', 'scheduleTo'],
						where: {
							bookingId: booking.id
						}
					});
				};

				return null
			}
		},
	}
});

export default BookingType;