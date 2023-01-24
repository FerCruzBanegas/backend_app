import {
  GraphQLInt as IntType,
  GraphQLString as StringType
} from 'graphql';
import { Booking } from '../../models';
import BookingHistoryType from '../../types/BookingHistoryType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers'
import { convert } from '../../../helpers/currencyConvertion';

const getBookingById = {

  type: BookingHistoryType,

  args: {
    bookingId: { type: IntType },
    requestCurrency: { type: StringType }
  },

  async resolve({ request }, { bookingId, requestCurrency }) {
    try {
      if (request.user) {
        let userId = request.user.id;
        let travellingPrice = 0, discountAmount = 0, estimatedTotalFare = 0, totalFare = 0, additionalFee = 0,
          userServiceFee = 0, partnerServiceFee = 0, userTotalFare = 0, partnerTotalFare = 0, specialBookingFare = 0, tipsTotalFare = 0, userPayableFare = 0, tipsAmount = 0;

          const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
          if (userStatusErrorMessage) {
              return {
                  status: userStatusError,
                  errorMessage: userStatusErrorMessage
              };
          }

        const result = await Booking.findOne({
          where: {
            id: bookingId,
            $or: [{
              userId
            }, {
              partnerId: userId
            }]
          },
          raw: true
        });

        if (result) {

          const { baseCurrency, rates } = await getCurrencyRates();
          requestCurrency = requestCurrency || result.currency
          result.requestCurrency = requestCurrency;

          if (requestCurrency != result.currency) {
            travellingPrice = convert(baseCurrency.currencyCode, rates, result.travellingPrice, result.currency, requestCurrency);
            discountAmount = convert(baseCurrency.currencyCode, rates, result.discountAmount, result.currency, requestCurrency);
            estimatedTotalFare = convert(baseCurrency.currencyCode, rates, result.estimatedTotalFare, result.currency, requestCurrency);
            totalFare = convert(baseCurrency.currencyCode, rates, result.totalFare, result.currency, requestCurrency);
            additionalFee = convert(baseCurrency.currencyCode, rates, result.additionalFee, result.currency, requestCurrency);
            userServiceFee = convert(baseCurrency.currencyCode, rates, result.userServiceFee, result.currency, requestCurrency);
            partnerServiceFee = convert(baseCurrency.currencyCode, rates, result.partnerServiceFee, result.currency, requestCurrency);
            userTotalFare = convert(baseCurrency.currencyCode, rates, result.userTotalFare, result.currency, requestCurrency);
            partnerTotalFare = convert(baseCurrency.currencyCode, rates, result.partnerTotalFare, result.currency, requestCurrency);
            specialBookingFare = convert(baseCurrency.currencyCode, rates, result.specialBookingFare, result.currency, requestCurrency);
            tipsTotalFare = convert(baseCurrency.currencyCode, rates, result.tipsTotalFare, result.currency, requestCurrency);
            tipsAmount = convert(baseCurrency.currencyCode, rates, result.tipsAmount, result.currency, requestCurrency);

            result.travellingPrice = travellingPrice;
            result.discountAmount = discountAmount;
            result.estimatedTotalFare = estimatedTotalFare;
            result.totalFare = totalFare;
            result.additionalFee = additionalFee;
            result.userServiceFee = userServiceFee;
            result.partnerServiceFee = partnerServiceFee;
            result.userTotalFare = userTotalFare;
            result.partnerTotalFare = partnerTotalFare;
            result.specialBookingFare = specialBookingFare;
            result.tipsTotalFare = tipsTotalFare;
            result.tipsAmount = tipsAmount;
          }
        }


        return {
          status: result ? 200 : 400,
          result: result ? result : {},
          errorMessage: result ? null : 'Oops! Unable to find the booking information.'
        };

      } else {
        return {
          status: 500,
          errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
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

export default getBookingById;