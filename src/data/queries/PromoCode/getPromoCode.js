import { GraphQLString as StringType } from 'graphql';
import moment from 'moment';

import sequelize from '../../sequelize';

import { PromoCode } from '../../models';

import PromoCodeCommonType from '../../types/PromoCodeCommonType';

import { convert } from '../../../helpers/currencyConvertion';
import getCurrencyRates from '../../../helpers/currencyRatesHelper';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getPromoCode = {

    type: PromoCodeCommonType,

    args: {
        requestCategories: { type: StringType },
        currency: { type: StringType },
        scheduledFrom: { type: StringType }
    },

    async resolve({ request }, { requestCategories, currency, scheduledFrom }) {
        try {

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            let result = [];
            let userId = request.user && request.user.id;
            let expDate = scheduledFrom === undefined ? new Date() : new Date(Number(scheduledFrom)).toJSON().split("T")[0]

            const promoCodeData = await PromoCode.findAll({
                where: {
                    $and: [
                        { isEnable: true },
                        { expiryDate: { $or: [{ $gte: moment().format("YYYY-MM-DD") }, { $eq: null }] } },
                        {
                            id: {
                                $notIn: [
                                    sequelize.literal(`
                                    SELECT 
                                        promoId 
                                    FROM 
                                        BookingPromoCode 
                                    WHERE 
                                        bookingId in (SELECT id FROM Booking where userId="${userId}" AND discountAmount > 0 AND status IN('expired', 'completed'))
                                    `)
                                ]
                            }
                        }
                    ]
                },
                raw: true
            });

            if (promoCodeData && promoCodeData.length > 0 && requestCategories && currency) {
                let categoryDetails = JSON.parse(requestCategories)
                const { rates, baseCurrency } = await getCurrencyRates();

                //Compare Promocode price and Booking Fare
                promoCodeData.map((promo) => {
                    let promoPrice = promo.promoValue, availableCategories = [];
                    if (promo.type === 2 && promo.currency && promo.currency !== currency) {
                        promoPrice = convert(baseCurrency, rates, promo.promoValue, promo.currency, currency)
                    }
                    categoryDetails.map((category) => {
                        if (promo.type === 1 || (promo.type === 2 && category.bookingFare > promoPrice)) availableCategories.push(category.categoryId)
                    })

                    result.push({ ...promo, availableCategories });
                });
            }
            else result = promoCodeData;

            return {
                status: 200,
                result
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error.message

            }
        }
    }
};

export default getPromoCode;