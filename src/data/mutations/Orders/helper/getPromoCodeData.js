import moment from 'moment';
import { Booking, PromoCode, BookingPromoCode } from '../../../models';

export async function getPromoCodeData(userId, promoId) {
	try {

		var today = new Date();
		let findAlreadyUsedCouponIds = [], findBookingPromoCode = [], bookingId = [], findBookings = [];

		findBookings = await Booking.findAll({
			attributes: ['id'],
			where: {
				userId,
				status: {
					$in: ['created', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByPartner', 'completed']
				}
			},
			raw: true
		});

		bookingId = findBookings && findBookings.length > 0 && findBookings.map((item) => { return item.id });

		if (bookingId && bookingId.length > 0) {
			findBookingPromoCode = await BookingPromoCode.findAll({
				attributes: ['id', 'promoId'],
				where: {
					bookingId: {
						$in: bookingId
					}
				},
				raw: true
			});
		}

		findAlreadyUsedCouponIds = findBookingPromoCode && findBookingPromoCode.length > 0 && findBookingPromoCode.map((o) => { return o.promoId });

		const promoData = await PromoCode.findOne({
			attributes: ['id', 'code', 'promoValue', 'type', 'currency'],
			where: {
				isEnable: 1,
				expiryDate: {
					$or: [{
						$gte: moment().format("YYYY-MM-DD")
					}, {
						$eq: null
					}]
				},
				$and: [{
					id: promoId
				}, {
					id: {
						$notIn: findAlreadyUsedCouponIds
					}
				}]
			},
			raw: true
		});

		return await {
			promoData
		};
	} catch (error) {
		return {
			status: 400,
			errorMessage: 'Oops! Something went wrong! ' + error.message
		};
	}
}