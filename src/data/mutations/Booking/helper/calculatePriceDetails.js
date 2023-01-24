import { OrderItems } from '../../../models';
import { getCurrencyRates } from '../../../../helpers/booking/commonHelpers';
import { getPercentageValue } from '../../../../helpers/getPercentage';
import { convert } from '../../../../helpers/currencyConvertion';

export async function calculatePriceDetails(bookingData, partnerConvertCurrency, bookingPromo, additionalAmount) {
	try {
		let subTotal = 0;
		let total = 0, userServiceFee = 0, partnerServiceFee = 0, userTotalFare = 0, partnerTotalFare = 0;
		let isSpecialService = false, specialServiceFare = 0, specialServiceTotalFare = 0, additionalFee = 0, travellingPrice = 0;

		// Pulling the Currency information
		const { baseCurrency, rates } = await getCurrencyRates();

		const orderItems = await OrderItems.findAll({
			where: { orderId: bookingData.orderId },
			raw: true
		});

		if (orderItems && orderItems.length > 0) {
			let fare = 0;
			await Promise.all(orderItems.map(async (data) => {
				if (bookingData.pricingType === 'fixed') {
					fare = (data.totalQuantity * data.baseFare);
					subTotal = subTotal + fare;
				} else {
					fare = data.minimumHours * data.baseFare;
					if (data.workedDuration > data.minimumHours) fare = data.baseFare * data.workedDuration;
					subTotal = subTotal + fare
				}

			}));

			travellingPrice = bookingData.travellingPrice;

			if (bookingData.userServiceFeeType === 'fixed') {
				userServiceFee = bookingData.userServiceFee;
			} else {
				userServiceFee = await getPercentageValue((subTotal + travellingPrice), bookingData.userServiceFeeValue);
			}

			if (bookingData.partnerServiceFeeType === 'fixed') {
				partnerServiceFee = bookingData.partnerServiceFee;
			} else {
				partnerServiceFee = await getPercentageValue((subTotal + travellingPrice), bookingData.partnerServiceFeeValue);
			}

			travellingPrice = bookingData.travellingPrice;
			if (additionalAmount && additionalAmount > 0) {
				if (partnerConvertCurrency !== bookingData.currency) {
					additionalFee = convert(baseCurrency.currencyCode, rates, additionalAmount, partnerConvertCurrency, bookingData.currency);
				} else {
					additionalFee = additionalAmount;
				}
			}


			userTotalFare = subTotal + userServiceFee + additionalFee + travellingPrice;
			partnerTotalFare = (subTotal + additionalFee + travellingPrice) - partnerServiceFee;
			total = subTotal + userServiceFee + additionalFee + travellingPrice;

			// If promo applied
			if (bookingPromo) {
				if (bookingPromo.type === 1) { // Percentage
					specialServiceFare = await getPercentageValue(subTotal, bookingPromo.promoValue);
				}
				isSpecialService = true;
				specialServiceTotalFare = total - specialServiceFare;
			}

			let priceDetails = {};

			priceDetails.isSpecialService = isSpecialService;
			priceDetails.specialServiceFare = specialServiceFare;
			priceDetails.specialServiceTotalFare = specialServiceTotalFare;
			priceDetails.subTotal = subTotal;
			priceDetails.currency = bookingData.currency;
			priceDetails.userServiceFee = userServiceFee;
			priceDetails.total = total;
			priceDetails.categoryId = bookingData.id;
			priceDetails.pricingType = bookingData.pricingType;
			priceDetails.userServiceFeeType = bookingData.userServiceFeeType;
			priceDetails.userServiceFeeValue = bookingData.userServiceFeeValue;
			priceDetails.partnerServiceFeeType = bookingData.partnerServiceFeeType;
			priceDetails.partnerServiceFeeValue = bookingData.partnerServiceFeeValue;
			priceDetails.partnerServiceFee = partnerServiceFee;
			priceDetails.userTotalFare = userTotalFare;
			priceDetails.partnerTotalFare = partnerTotalFare;
			priceDetails.travellingPrice = travellingPrice;
			priceDetails.additionalFee = additionalFee;
			priceDetails.userPayableFare = isSpecialService ? Number(specialServiceTotalFare) : Number(userTotalFare);

			return await {
				priceStatus: 200,
				priceDetails
			}

		} else {
			return await {
				priceStatus: 400,
				priceErrorMessage: "Oops! Unable to find the booking information."
			}
		}

	} catch (error) {
		return {
			priceStatus: 400,
			priceErrorMessage: "Oops! Something went wrong! " + error
		};
	}
}