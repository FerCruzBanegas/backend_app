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

const addCardDetails = {

  type: WholeAccountType,

  args: {
    paymentMethod: { type: new NonNull(StringType) },
    cardLastFour: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { paymentMethod, cardLastFour }) {

    if (request.user) {

      const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
      if (userStatusErrorMessage) {
          return {
              status: userStatusError,
              errorMessage: userStatusErrorMessage
          };
      }

      let userId = request.user.id, email = request.user.email, customerId, createCustomer;
      let status = 200, errorMessage, updateUserProfile;
      let paymentIntentId, requireAdditionalAction = false, paymentIntentSecret = null;

      try {

        customerId = await getCustomerId(userId);

        if (!customerId) {
          createCustomer = await stripe.customers.create(
            { email: email }
          );

          if (createCustomer && createCustomer.id) {
            customerId = createCustomer.id;

            let updateCustomerId = await UserProfile.update({
              paymentCustomerId: customerId
            }, {
              where: {
                userId
              }
            });

            status = 200;
          } else {
            errorMessage = 'Oops, something went wrong! Unable to connect your card';
            status = 400;
          }
        }
      } catch (error) {
        errorMessage = 'Oops, something went wrong!' + error;
        status = 400;
      }

      try {
        if (status == 200) {
          let paymentIntent = await stripe.setupIntents.create({
            payment_method: paymentMethod,
            payment_method_types: ['card'],
            confirm: true,
            customer: customerId,
            usage: 'off_session'
          });

          if (paymentIntent && paymentIntent.status === 'requires_action' && paymentIntent.next_action
            && paymentIntent.next_action.type == 'use_stripe_sdk') {
            // Authentication requires for the 3D secure cards
            requireAdditionalAction = true;
            paymentIntentSecret = paymentIntent.client_secret;
            paymentIntentId = paymentIntent.id;
            status = 200;
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // No need authentication for the non 3D secure cards
            status = 200;
            const attachCardToCustomer = await stripe.paymentMethods.attach(
              paymentIntent.payment_method, {
              customer: customerId,
            }
            );
          } else {
            status = 400;
            errorMessage = 'Oops, something went wrong! Please try again.'
          }
        } else {
          status = 400;
          errorMessage = 'Oops, something went wrong!, We are unable to connect your card.';
        }
      } catch (error) {
        errorMessage = 'Oops, something went wrong!' + error;
        status = 400;
      }

      if (status == 200 && !requireAdditionalAction) {
        updateUserProfile = await UserProfile.update({
          paymentCustomerId: customerId,
          cardLastFour,
          preferredPaymentMethod: 2,
          paymentMethodId: paymentMethod
        },
          {
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
          paymentIntentId,
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

export default addCardDetails;

/**
mutation addCardDetails($cardToken: String!, $cardLastFour: String!) {
  addCardDetails(cardToken: $cardToken, cardLastFour: $cardLastFour) {
    status
    errorMessage
  }
}
 */
