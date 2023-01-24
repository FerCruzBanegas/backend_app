import {
	GraphQLString as StringType,
	GraphQLFloat as FloatType
} from 'graphql';
import stripePackage from 'stripe';
import { UserProfile, WalletHistory } from '../../models';
import WholeAccountType from '../../types/WholeAccountType';
import { payment } from '../../../config';
import { convert } from '../../../helpers/currencyConvertion';
import {
	getCurrencyRates
} from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const stripe = stripePackage(payment.stripe.secretKey);

const confirmPaymentIntent = {

	type: WholeAccountType,

	args: {
		paymentIntentId: { type: StringType },
		cardLastFour: { type: StringType },
		amount: { type: FloatType },
		currency: { type: StringType }
	},

	async resolve({ request }, { paymentIntentId, cardLastFour, amount, currency }) {
		if (request.user) {
			
			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			let userId = request.user.id, status = 200, transactionId;
			let requireAdditionalAction = false, paymentIntentSecret = '';
			let updatedWalletBalance = 0;
			try {

				let confirmIntent = await stripe.paymentIntents.confirm(paymentIntentId);

				if (confirmIntent && confirmIntent.id && confirmIntent.status == 'succeeded') {

					const userData = await UserProfile.findOne({
						attributes: ['userId', 'preferredCurrency', 'paymentCustomerId', 'walletBalance', 'walletUsed'],
						where: {
							userId
						},
						raw: true
					});

					transactionId = confirmIntent.id;

					const createWalletHistory = await WalletHistory.create({
						userId,
						transactionId,
						cardLast4Digits: cardLastFour,
						amount,
						currency
					});

					if (createWalletHistory) {
						if (currency === userData.preferredCurrency) {
							updatedWalletBalance = userData.walletBalance + amount;
						} else {
							const { baseCurrency, rates } = await getCurrencyRates();
							updatedWalletBalance = convert(
								baseCurrency,
								rates,
								amount,
								currency,
								userData.preferredCurrency
							);
							updatedWalletBalance = userData.walletBalance + updatedWalletBalance;
						}

						const updateWalletBalance = await UserProfile.update({
							walletBalance: updatedWalletBalance
						}, {
							where: {
								userId
							}
						});
					}
					status = 200;
				} else if (confirmIntent && confirmIntent.id && confirmIntent.status == 'requires_action') {
					status = 200;
					requireAdditionalAction = true;
					paymentIntentSecret = confirmIntent.client_secret;
				}
			} catch (error) {
				status = 400;
			}

			return await {
				status,
				errorMessage: '',
				result: {
					requireAdditionalAction,
					paymentIntentSecret,
					walletBalance: updatedWalletBalance
				}
			}


		} else {
			return {
				status: 500,
				errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
			}
		}

	},
};

export default confirmPaymentIntent;

// mutation confirmPaymentIntent(
// 	$paymentIntentId: String,
// 	$cardLastFour: String,
// 	$amount: Float,
//   $currency: String
// ) {
// 	confirmPaymentIntent(
// 		paymentIntentId: $paymentIntentId,
// 		cardLastFour: $cardLastFour,
// 		amount: $amount,
//     currency: $currency
// 	) {
// 		status
// 		errorMessage
// 	}
// }

