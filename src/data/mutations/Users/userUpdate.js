// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { UserLogin, UserProfile, CurrencyRates } from '../../models';

// Types
import UserType from '../../types/UserType';

import { convert } from '../../../helpers/currencyConvertion';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const userUpdate = {

    type: UserType,

    args: {
        userId: { type: new NonNull(StringType) },
        fieldName: { type: new NonNull(StringType) },
        fieldValue: { type: StringType },
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, {
        userId,
        fieldName,
        fieldValue,
        deviceType,
        deviceId,
    }) {
        let where, userToken, currentToken, updateUser;
        let userProfileData, existingPreferredCurrency, walletBalance, ratesData = {};

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                currentToken = request.headers.auth;

                where = {
                    userId,
                    deviceType,
                    deviceId,
                    key: currentToken
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin && request.user.id === userId) {

                    if (fieldName === 'preferredCurrency') { // To update Wallet amount value for currency changes
                        userProfileData = await UserProfile.findOne({
                            attributes: ['preferredCurrency', 'walletBalance'],
                            where: {
                                userId
                            },
                            raw: true
                        });

                        existingPreferredCurrency = userProfileData && userProfileData.preferredCurrency;

                        if (fieldValue !== existingPreferredCurrency) {
                            const currencyRates = await CurrencyRates.findAll({
                                attributes: ['currencyCode', 'rate', 'isBase'],
                                raw: true
                            });

                            const baseCurrency = currencyRates.find(o => o && o.isBase);

                            currencyRates.map((item) => { ratesData[item.currencyCode] = item.rate });

                            walletBalance = convert(
                                baseCurrency.currencyCode,
                                ratesData,
                                userProfileData.walletBalance,
                                existingPreferredCurrency,
                                fieldValue
                            );
                        } else {
                            walletBalance = userProfileData.walletBalance;
                        }

                        updateUser = await UserProfile.update(
                            {
                                [fieldName]: fieldValue,
                                walletBalance
                            },
                            {
                                where: {
                                    userId: request.user.id
                                }
                            }
                        );
                    } else { // Other settings
                        updateUser = await UserProfile.update(
                            {
                                [fieldName]: fieldValue
                            },
                            {
                                where: {
                                    userId: request.user.id
                                }
                            }
                        );
                    }

                    return await {
                        status: updateUser ? 200 : 400,
                        errorMessage: updateUser ? null : "Something went wrong with " + fieldName + " changes. Please try again.",
                        userToken
                    };

                } else {
                    return {
                        errorMessage: "You haven't authorized for this action.",
                        status: 500,
                        userToken
                    };
                }
            } else {
                return {
                    errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue.",
                    status: 500,
                    userToken
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400,
                userToken
            }
        }
    }
};

export default userUpdate;

/*

mutation (
   $userId: String!,
   $fieldName: String!,
   $fieldValue: String,
   $deviceType: String!,
   $deviceId: String!) {
   userUpdate (
       userId: $userId,
       fieldName: $fieldName,
       fieldValue: $fieldValue,
       deviceType: $deviceType,
       deviceId: $deviceId
   ) {
       status
       userToken
       errorMessage
   }
}

*/