import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import stripePackage from 'stripe';
import { Payout, User } from '../../models';
import GetPayoutType from '../../types/GetPayoutType';
import { payment, url } from '../../../config';
import { isEuropeCountry } from '../../../helpers/europeCountryHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const stripe = stripePackage(payment.stripe.secretKey, {
  apiVersion: '2019-12-03'
});


const addPayout = {

  type: GetPayoutType,

  args: {
    methodId: { type: IntType },
    payEmail: { type: StringType },
    address1: { type: StringType },
    address2: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    country: { type: StringType },
    zipcode: { type: StringType },
    currency: { type: StringType },
    firstname: { type: StringType },
    lastname: { type: StringType },
    accountNumber: { type: StringType },
    routingNumber: { type: StringType },
    businessType: { type: StringType },
    accountToken: { type: StringType },
    personToken: { type: StringType },
  },

  async resolve({ request }, {
    methodId,
    payEmail,
    address1,
    address2,
    city,
    state,
    country,
    zipcode,
    currency,
    firstname,
    lastname,
    accountNumber,
    routingNumber,
    businessType,
    accountToken,
    personToken
  }) {

    try {
      let userId = request.user.id;
      let status = 200, errorMessage, createPayout, connectUrl, stripeAccountId;
      let business_type = null, external_account = {}, defaultvalue = false;
      let requested_capabilities = ['card_payments', 'transfers'];

      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        let where = {
          id: userId,
          isBan: 1
        };

        let createPersonToken, person;

        const isUserBan = await User.findOne({ attributes: ['id'], where, raw: true });

        if (isUserBan) {
          return {
            status: 400,
            errorMessage: 'Oops! It looks like your account is deactivated and please contact support.'
          }
        } else {
          if (methodId == 1) {
            //Pay Pal
            let count = await Payout.count({
              where: {
                userId,
                isDefault: true
              }
            });

            const payout = await Payout.create({
              methodId,
              userId,
              payEmail,
              address1,
              address2,
              city,
              state,
              country,
              zipcode,
              currency,
              isDefault: count <= 0 ? true : false,
              last4Digits: null,
              isVerified: true,
              firstName: firstname,
              lastName: lastname
            });

            return {
              status: payout ? 200 : 400,
              errorMessage: payout ? null : 'Oops! Something went wrong'
            }

          } else if (methodId == 2) {

            try {

              business_type = businessType ? businessType : 'individual';
              external_account = {
                object: "bank_account",
                country: country,
                currency: currency,
                account_number: accountNumber
              };

              if (!isEuropeCountry(country) && routingNumber) { // Non Europe countries - Routing Number param
                external_account['routing_number'] = routingNumber;
              }

              if (business_type === 'individual') {
                createPayout = await stripe.accounts.create({
                  type: "custom",
                  country: country,
                  email: payEmail,
                  requested_capabilities,
                  external_account,
                  account_token: accountToken,
                });

                stripeAccountId = createPayout.id;

              } else if (business_type === 'company') {

                if (!personToken) {
                  person = {
                    email: payEmail,
                    address: {
                      line1: address1,
                      city: city,
                      state: state,
                      country: country,
                      postal_code: zipcode
                    },
                    relationship: {
                      representative: true
                    }
                  };
                  createPersonToken = await stripe.tokens.create({ person });
                  if (createPersonToken) {
                    personToken = createPersonToken && createPersonToken.id;
                  } else {
                    status = 400;
                    errorMessage = createPersonToken.message || (createPersonToken.error && createPersonToken.error.message);
                  };
                }

                createPayout = await stripe.accounts.create({
                  type: "custom",
                  country,
                  email: payEmail,
                  requested_capabilities,
                  external_account,
                  account_token: accountToken,
                });

                stripeAccountId = createPayout.id;

                // Because this is a business (and not an individual), we'll need to specify
                // the account opener by email address using the Persons API.
                const accountOpener = await stripe.account.createPerson(stripeAccountId, {
                  person_token: personToken
                });
              }

              let successUrl = url + '/user/payout/success?account=' + stripeAccountId;
              let failureUrl = url + '/user/payout/failure?account=' + stripeAccountId;

              const accountLinks = await stripe.accountLinks.create({
                account: stripeAccountId,
                failure_url: failureUrl,
                success_url: successUrl,
                type: 'custom_account_verification',
                collect: 'currently_due', // currently_due or eventually_due
              });

              connectUrl = accountLinks.url; // Account links API on-boarding URL

              return await {
                status,
                errorMessage,
                result: {
                  connectUrl,
                  successUrl,
                  failureUrl,
                  stripeAccountId
                }
              }

            } catch (error) {
              return {
                status: 400,
                errorMessage: error.message
              }
            }

          } else {
            return {
              status: 400,
              errorMessage: 'Please choose the payout method and try again'
            }
          }
        }

      } else {
        return {
          status: 500,
          errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
        };
      }
    } catch (error) {
      return {
        status: 400,
        errorMessage: 'Oops! Something went wrong! ' + error.message
      }
    }
  },
};

export default addPayout;

