import {
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
} from 'graphql';
import { UserProfile, User, UserLogin } from '../../models';
import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updatePaymentMethod = {

	type: UserAccountType,

	args: {
		paymentMethodId: { type: new NonNull(IntType) }
	},

	async resolve({ request }, { paymentMethodId }) {

		try {

			if (request.user) {
				let userId = request.user.id, currentToken, where;
				currentToken = request.headers.auth;

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				where = {
					userId: request.user.id,
					key: currentToken
				};

				const isUserExist = await User.findOne({
					attributes: ['id'],
					where: {
						id: userId
					}
				});

				const checkLogin = await UserLogin.findOne({
					attributes: ['id'],
					where
				});

				if (isUserExist && checkLogin) {
					const updatePaymentMethod = await UserProfile.update({
						preferredPaymentMethod: paymentMethodId
					}, {
						where: {
							userId
						}
					});

					return {
						status: updatePaymentMethod ? 200 : 400,
						errorMessage: updatePaymentMethod ? null : "Unable to update."
					};
				} else {
					return {
						errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue.",
						status: 500
					};
				}

			} else {
				return {
					errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue.",
					status: 500
				};
			}

		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}

	},
};

export default updatePaymentMethod;

/**
mutation updatePaymentMethod($paymentMethodId: Int!) {
	updatePaymentMethod(paymentMethodId: $paymentMethodId) {
		status
		errorMessage
	}
}
 */
