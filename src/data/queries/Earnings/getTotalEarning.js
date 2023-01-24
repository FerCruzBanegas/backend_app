import moment from 'moment';

import {
	Booking,
	UserProfile
} from '../../models';

import EarningsType from '../../types/EarningsType';

import getCurrencyRates from '../../../helpers/currencyRatesHelper';
import { calculateEarnings } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getTotalEarning = {

	type: EarningsType,

	async resolve({ request }) {
		try {
			if (!request.user || !request.user.id) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			let preferredCurrency, today = moment(),
				startDate = moment(today).startOf('week').startOf('day'),
				endDate = moment(startDate).endOf('week').endOf('day');
			let totalAcceptedBookings = 0,
				totalCompletedBookings = 0,
				weeklyAcceptedBookings = 0,
				weeklyCompletedBookings = 0;

			// Partner Preferred currency data
			const partnerProfileData = await UserProfile.findOne({
				attributes: ['preferredCurrency'],
				where: { userId: request.user.id },
				raw: true
			});

			preferredCurrency = partnerProfileData && partnerProfileData.preferredCurrency || 'USD';

			const { baseCurrency, rates } = await getCurrencyRates();

			/* Weekly Earnings */
			let weeklyBookingData = await Booking.findAll({
				attributes: ['id', 'partnerTotalFare', 'currency', 'tipsAmount'],
				where: {
					$and: [
						{ partnerId: request.user.id },
						{ status: 'completed' },
						{
							completedAt: {
								$and: [
									{ $lte: endDate },
									{ $gte: startDate }
								]
							}
						}
					]
				},
				raw: true
			});

			let weeklyCancelledBookingData = await Booking.count({
				where: {
					$and: [
						{ partnerId: request.user.id },
						{ status: { $in: ['cancelledByUser', 'cancelledByPartner'] } },
						{
							completedAt: {
								$and: [
									{ $lte: endDate },
									{ $gte: startDate }
								]
							}
						}
					]
				},
				raw: true
			});

			weeklyCompletedBookings = weeklyBookingData.length;
			weeklyAcceptedBookings = weeklyCompletedBookings + weeklyCancelledBookingData;

			const weeklyEarningsData = calculateEarnings(weeklyBookingData, rates, baseCurrency, preferredCurrency);

			/* Total Earnings */
			let totalBookingData = await Booking.findAll({
				attributes: ['id', 'partnerTotalFare', 'currency', 'tipsAmount'],
				where: {
					$and: [
						{ partnerId: request.user.id },
						{ status: 'completed' },
					]
				},
				raw: true
			});

			let totalCancelBookingData = await Booking.count({
				where: {
					$and: [
						{ partnerId: request.user.id },
						{ status: { $in: ['cancelledByUser', 'cancelledByPartner'] } },
					]
				},
				raw: true
			});

			totalCompletedBookings = totalBookingData.length;
			totalAcceptedBookings = totalCancelBookingData + totalCompletedBookings;

			const { totalTips, totalEarnings } = calculateEarnings(totalBookingData, rates, baseCurrency, preferredCurrency);

			return {
				status: 200,
				result: {
					currency: preferredCurrency,
					startDate,
					endDate,
					weeklyAcceptedBookings,
					weeklyCompletedBookings,
					weeklyTotaltips: weeklyEarningsData && weeklyEarningsData.totalTips && weeklyEarningsData.totalTips.toFixed(2),
					weeklyTotalEarnings: weeklyEarningsData && weeklyEarningsData.totalEarnings && weeklyEarningsData.totalEarnings.toFixed(2),
					totalAcceptedBookings,
					totalCompletedBookings,
					totalTips: totalTips ? totalTips.toFixed(2) : totalTips,
					totalEarnings: totalEarnings ? totalEarnings.toFixed(2) : totalEarnings
				}
			};
		}
		catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}

	},
};

export default getTotalEarning;



/**
query {
	getTotalEarning {
		result {
				currency
				startDate
				endDate
				weeklyTotalBookings
				weeklyTotalEarnings
				weeklyTotalDuration
				totalBookings
				totalEarnings
		}
		status
		errorMessage
	}
}

 */
