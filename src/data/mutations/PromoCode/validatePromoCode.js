import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import moment from 'moment';

import sequelize from '../../sequelize';

import { User, PromoCode } from '../../models';

import PromoCodeType from '../../types/PromoCodeType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const validatePromoCode = {

    type: PromoCodeType,

    args: {
        code: { type: new NonNull(StringType) },
        id: { type: IntType }
    },

    async resolve({ request }, { code, id }) {
        try {
            let idFilter = {};

            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: 'Oops! It looks like you are not logged-in with your account. Please login and continue.'
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            let alreadyUsedFilter = {
                id: {
                    $notIn: [
                        sequelize.literal(`
                        SELECT 
                            promoId 
                        FROM 
                            BookingPromoCode 
                        WHERE 
                            bookingId in (SELECT id FROM Booking where userId="${request.user.id}" AND discountAmount > 0 AND status IN('expired', 'completed'))
                        `)
                    ]
                }
            };

            if (id) idFilter = { id };

            let userData = await User.findOne({
                attributes: ['id', 'isBan'],
                where: {
                    id: request.user.id,
                    deletedAt: null,
                    isBan: false
                },
                raw: true
            });

            if (!userData) {
                return await {
                    status: 500,
                    errorMessage: 'Oops! It looks like something went wrong with your account. Please login again and continue.'
                };
            }

            const isValidated = await PromoCode.findOne({
                attributes: ['id', 'code'],
                where: {
                    $and: [
                        { isEnable: true },
                        idFilter,
                        { code },
                        {
                            expiryDate: {
                                $or: [{
                                    $gte: moment().format("YYYY-MM-DD")
                                }, {
                                    $eq: null
                                }]
                            }
                        },
                        alreadyUsedFilter
                    ]
                },
                raw: true
            });

            if (!isValidated || !isValidated.code) {
                return {
                    status: 400,
                    errorMessage: 'Oops! it looks like you provided code is invalid.'
                };
            }

            return { status: 200 };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error.message

            }
        }
    }
};

export default validatePromoCode;

/*       
mutation ($code: String!,$id: Int) {
  validatePromoCode(code: $code, id: $id) {
    status
    errorMessage
  }
}
*/
