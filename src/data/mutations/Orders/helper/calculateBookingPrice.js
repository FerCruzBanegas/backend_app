import { Orders } from '../../../models';
import { getCurrencyRates } from '../../../../helpers/booking/commonHelpers';
import { convert } from '../../../../helpers/currencyConvertion';
import { getPercentageValue } from '../../../../helpers/getPercentage';


export async function calculateBookingPrice(availableCategory, subTotal, promoCodeData, userLocationDetails, requestCurrency, orderId, userId, partnerProfileData) {
	try {
		let total = 0, userServiceFee = 0, partnerServiceFee = 0, userTotalFare = 0, partnerTotalFare = 0;
		let isSpecialService = false, specialServiceFare = 0, specialServiceTotalFare = 0, travellingPrice = 0;
		let userServiceFeeValue = 0, partnerServiceFeeValue = 0;

		const { baseCurrency, rates } = await getCurrencyRates();

		let convertCurrency = requestCurrency || userLocationDetails && userLocationDetails.preferredCurrency;

		userServiceFeeValue = availableCategory.userServiceFeeValue;
		partnerServiceFeeValue = availableCategory.partnerServiceFeeValue;

		if (convertCurrency !== availableCategory.currency) {
			travellingPrice = convert(baseCurrency.currencyCode, rates, availableCategory.travellingPrice, availableCategory.currency, convertCurrency);
		} else {
			travellingPrice = availableCategory.travellingPrice;
		}

		userServiceFee = await getPercentageValue((subTotal + travellingPrice), userServiceFeeValue);
		partnerServiceFee = await getPercentageValue((subTotal + travellingPrice), partnerServiceFeeValue);

		userTotalFare = subTotal + userServiceFee + travellingPrice;
		partnerTotalFare = (subTotal + travellingPrice) - partnerServiceFee;
		total = subTotal + userServiceFee + travellingPrice;

		// If promo applied
		if (promoCodeData) {
			if (promoCodeData.type === 1) { // Percentage
				specialServiceFare = await getPercentageValue(subTotal, promoCodeData.promoValue);
			}
			isSpecialService = true;
			specialServiceTotalFare = total - specialServiceFare;
		}

		const updateOrderPromo = await Orders.update({
			promoId: promoCodeData ? promoCodeData.id : null,
		}, {
			where: {
				userId,
				id: orderId
			}
		});

		let convertPartnerTotalFare = partnerTotalFare;
		if (partnerProfileData && partnerProfileData.preferredCurrency !== convertCurrency) {
			convertPartnerTotalFare = convert(baseCurrency.currencyCode, rates, partnerTotalFare, convertCurrency, partnerProfileData.preferredCurrency);
		}

		let priceDetails = {};

		priceDetails.isSpecialService = isSpecialService;
		priceDetails.specialServiceFare = specialServiceFare.toFixed(2);
		priceDetails.specialServiceTotalFare = specialServiceTotalFare.toFixed(2);
		priceDetails.subTotal = subTotal.toFixed(2);
		priceDetails.currency = convertCurrency;
		priceDetails.userServiceFee = userServiceFee.toFixed(2);
		priceDetails.total = total.toFixed(2);
		priceDetails.categoryId = availableCategory.id;
		priceDetails.pricingType = availableCategory.pricingType;
		priceDetails.userServiceFeeType = availableCategory.userServiceFeeType;
		priceDetails.userServiceFeeValue = userServiceFeeValue.toFixed(2);
		priceDetails.partnerServiceFeeType = availableCategory.partnerServiceFeeType;
		priceDetails.partnerServiceFeeValue = partnerServiceFeeValue.toFixed(2);
		priceDetails.partnerServiceFee = partnerServiceFee.toFixed(2);
		priceDetails.userTotalFare = userTotalFare.toFixed(2);
		priceDetails.partnerTotalFare = partnerTotalFare.toFixed(2);
		priceDetails.userPayableFare = isSpecialService ? Number(specialServiceTotalFare).toFixed(2) : Number(userTotalFare).toFixed(2)
		priceDetails.travellingPrice = travellingPrice.toFixed(2);
		priceDetails.convertPartnerTotalFare = convertPartnerTotalFare.toFixed(2);

		return await {
			bookingStatus: 200,
			priceDetails
		}

	} catch (error) {
		return {
			bookingStatus: 400,
			bookingErrorMessage: "Something went wronng"
		};
	}
}