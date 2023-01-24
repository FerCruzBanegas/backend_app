import moment from 'moment';
import {
	CurrencyRates,
	User,
	UserProfile,
	PromoCode
} from '../../data/models';
import sequelize from '../../data/sequelize';

import { convert } from '../currencyConvertion';
import { formatExponentialNumber } from '../formatNumbers';

const getCurrencyRates = async () => {
	try {
		let baseCurrency, rates = {};

		// Currency Rates & information
		const currencyRatesData = await CurrencyRates.findAll({
			attributes: ['currencyCode', 'rate', 'isBase'],
			raw: true
		});

		baseCurrency = currencyRatesData.find(o => o && o.isBase);
		baseCurrency = baseCurrency.currencyCode;

		currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });

		return await {
			baseCurrency,
			rates
		};
	} catch (error) {
		console.log('getCurrencyRates Error: ', error);
		return {
			baseCurrency: null,
			rates: null
		};
	}
};

// Fetch the user profile data with user data
const getUserProfileData = async (userId, requestProfileParams, requestUserParams) => {
	try {
		let profileAttributes = requestProfileParams || ['profileId', 'userId', 'firstName', 'lastName', 'picture',
			'preferredCurrency', 'preferredPaymentMethod', 'preferredLanguage', 'preferredLocation', 'preferredLat', 'preferredLng'];

		let userAttributes = requestUserParams || ['id', 'email', 'phoneNumber', 'phoneDialCode', 'lat', 'lng',
			'userStatus', 'isActive', 'isBan', 'userType', 'createdAt', 'updatedAt', 'overallRating', 'phoneCountryCode'];

		return await UserProfile.findOne({
			attributes: profileAttributes,
			where: {
				userId
			},
			include: [{
				model: User,
				as: 'user',
				attributes: userAttributes,
				required: true,
				where: {
					id: userId,
					deletedAt: null
				},
			}],
			raw: true
		});
	} catch (error) {
		console.log('getUserProfileData Error: ', error);
		return null;
	}
}

// Check the user is ban or deleted
const getUserBanStatus = async (id) => {
	try {
		let userStatusErrorMessage;
		const userStatus = await User.findOne({
			attributes: ['isBan', 'deletedAt'],
			where: {
				id
			},
			raw: true
		});

		if (userStatus && userStatus.deletedAt) {
			userStatusErrorMessage = 'Oops! Something went wrong. Please contact our support.'
		} else if (userStatus && userStatus.deletedAt) {
			userStatusErrorMessage = 'Oops! It looks like your account is disabled at the memont. Please contact our support.'
		}

		return await {
			isBan: userStatus && userStatus.isBan,
			deletedAt: userStatus && userStatus.deletedAt,
			userStatusErrorMessage
		};
	} catch (error) {
		console.log('getUserBanStatus Error: ', error);
		return null;
	}

}

const getPromoCodeData = async (id, riderId, bookingId) => {
	try {
		if (!id || !riderId || !bookingId) {
			return null;
		}

		return await PromoCode.findOne({
			attributes: ['id', 'code', 'type', 'promoValue', 'currency', 'expiryDate'],
			where: {
				$and: [
					{ id },
					{ isEnable: true },
					{
						expiryDate: {
							$or: [{
								$gte: moment().format("YYYY-MM-DD")
							}, {
								$eq: null
							}]
						}
					},
					{
						id: {
							$notIn: [
								sequelize.literal(`SELECT promoCodeId FROM Booking WHERE promoCodeId=${id} AND riderId="${riderId}" AND isSpecialTrip=1 AND id!=${bookingId}`)
							]
						}
					}
				]
			},
			raw: true
		});
	} catch (error) {
		console.log('getPromoCodeData Error: ', error);
		return null;
	}
}

const calculateEarnings = (bookingData, rates, baseCurrency, toCurrency) => {
	let totalTips = 0, totalEarnings = 0;

	if (bookingData && bookingData.length > 0) {
		bookingData.map((item) => {
			let bookingFare = (item.partnerTotalFare && Number(item.partnerTotalFare) > 0) ? formatExponentialNumber(Number(item.partnerTotalFare)) : 0;
			if (toCurrency !== item.currency && bookingFare > 0) bookingFare = convert(baseCurrency, rates, bookingFare, item.currency, toCurrency);

			let tipsFare = (item.tipsAmount && Number(item.tipsAmount) > 0) ? formatExponentialNumber(Number(item.tipsAmount)) : 0;
			if (toCurrency !== item.currency && tipsFare > 0) tipsFare = convert(baseCurrency, rates, tipsFare, item.currency, toCurrency);

			totalTips = totalTips + tipsFare; // Tips
			totalEarnings = totalEarnings + bookingFare + tipsFare;
		});
	}

	return {
		totalBookings: bookingData && bookingData.length || 0,
		totalTips,
		totalEarnings
	};
}

const updatePartnerActiveStatus = async (id, status) => {
    try {
        return await User.update({
            activeStatus: status
        }, {
            where: {
                id
            }
        });
    } catch (error) {
        return false;
    }
}

module.exports = {
	getCurrencyRates,
	getUserProfileData,
	getUserBanStatus,
	getPromoCodeData,
	calculateEarnings,
	updatePartnerActiveStatus
};