import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { Booking, User, UserLogin } from '../../models';
import BookingHistoryType from '../../types/BookingHistoryType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getAllBookings = {

  type: BookingHistoryType,

  args: {
    currentPage: { type: IntType },
    requestType: { type: StringType }, // previous / upcoming
    requestCurrency: { type: StringType }
  },

  async resolve({ request }, { currentPage, requestType, requestCurrency }) {
    try {
      if (request.user) {
        let userId = request.user.id;
        let userType = 1, where = {};
        let limit = 5, offset = 0;
        let status = requestType !== 'previous' ? ['created', 'approved', 'arrived', 'reviewed', 'started', 'scheduled'] : ['declined', 'cancelledByUser', 'cancelledByPartner', 'completed'];
        let order = [['id', 'DESC']];
      
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
            return {
                status: userStatusError,
                errorMessage: userStatusErrorMessage
            };
        }

        let userTypeLogin = await UserLogin.findOne({
          attributes: ['userType'],
          where: {
            key: request.headers.auth,
          },
          raw: true
        });

        userType = userTypeLogin && userTypeLogin.userType;

        if (userType === 1) {
          where['userId'] = userId;
          requestType === 'previous' ? status.push('expired') : null;
        } else {
          where['partnerId'] = userId;
        }

        // Filter
        where['status'] = {
          $in: status
        };

        if (currentPage) { // Pagination
          offset = (currentPage - 1) * limit;
        }

        const count = await Booking.count({
          where
        });

        const results = await Booking.findAll({
          where,
          limit,
          offset,
          order
        });

        if (results && results.length > 0) {
          await Promise.all(
            results.map((item, key) => {
              item.requestCurrency = requestCurrency;
            })
          );
        }

        return await {
          status: 200,
          results,
          count,
        };

      } else {
        return await {
          status: 500,
          errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
        }
      }
    } catch (error) {
      return {
        errorMessage: 'Oops! Something went wrong! ' + error,
        status: 400
      };
    }

  },
};

export default getAllBookings;
