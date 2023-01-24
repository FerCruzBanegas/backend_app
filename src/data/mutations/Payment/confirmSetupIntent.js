import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
} from 'graphql';
import stripePackage from 'stripe';
import { UserProfile } from '../../models';
import WholeAccountType from '../../types/WholeAccountType';
import { payment } from '../../../config';
import { getCustomerId } from '../../../libs/payment/stripe/helpers/getCustomerId';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const stripe = stripePackage(payment.stripe.secretKey);

const confirmSetupIntent = {

	type: WholeAccountType,

	args: {
		setupIntentId: { type: new NonNull(StringType) },
		cardLastFour: { type: new NonNull(StringType) },
		paymentMethod: { type: new NonNull(StringType) },
	},

	async resolve({ request }, { setupIntentId, cardLastFour, paymentMethod }) {

		if (request.user) {

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			let userId = request.user.id, setupIntent, status = 200, customerId;
			let requireAdditionalAction = false, paymentIntentSecret = '', errorMessage = '';
			let getSetupIntent;

			try {
				customerId = await getCustomerId(userId); // Get Stripe customer ID

				getSetupIntent = await stripe.setupIntents.retrieve(setupIntentId); // Get the setup information existing info

				if (getSetupIntent && getSetupIntent.status === 'requires_action' && getSetupIntent.next_action) {
					setupIntent = await stripe.setupIntents.confirm(setupIntentId, {
						payment_method: paymentMethod
					}); // Confirms the customer ID
				} else {
					setupIntent = getSetupIntent;
				}
			} catch (error) {
				if (error.setup_intent) {
					setupIntent = error.setup_intent;
				} else {
					status = 400;
					errorMessage = error.message || 'Something went wrong! Please try again.';
				}
			}

			if (setupIntent && setupIntent.status === 'requires_action') {
				status = 200;
				requireAdditionalAction = true;
				paymentIntentSecret = setupIntent.client_secret;
			}

			if (status === 200 && !requireAdditionalAction) {
				const attachCardToCustomer = await stripe.paymentMethods.attach(
					setupIntent.payment_method, {
					customer: customerId,
				}
				);

				await UserProfile.update({
					paymentMethodId: paymentMethod,
					cardLastFour,
					preferredPaymentMethod: 2
				}, {
					where: {
						userId
					}
				});
			}

			return await {
				status,
				errorMessage,
				result: {
					requireAdditionalAction,
					paymentIntentSecret,
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

export default confirmSetupIntent;

/**
mutation confirmSetupIntent($setupIntentId: String, $setupIntentStatus: Boolean, $paymentMethod: String) {
	confirmSetupIntent(setupIntentId: $setupIntentId, setupIntentStatus: $setupIntentStatus, paymentMethod: $paymentMethod) {
		status
		errorMessage
	}
}
 */
