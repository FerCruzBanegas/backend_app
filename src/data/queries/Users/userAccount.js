import {
  GraphQLInt as IntType
} from 'graphql';
import { User, UserProfile, UserLogin, Payout } from '../../models';
import WholeAccountType from '../../types/WholeAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';

const userAccount = {

  type: WholeAccountType,

  args: {
    userType: { type: IntType },
  },

  async resolve({ request, response }, { userType }) {

    let currentToken, where;

    try {
      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }


        //Collect from Logged-in User
        let userId = request.user.id;
        currentToken = request.headers.auth;
        where = {
          userId: request.user.id,
          key: currentToken
        };

        let loggedInDevice = await UserLogin.findOne({
          attributes: ['userId', 'deviceType', 'deviceId', 'userType'],
          where: {
            userId,
            userType
          },
          raw: true
        });

        if (loggedInDevice) {
          let content = {
            auth: currentToken,
            userId: loggedInDevice && loggedInDevice.userId,
            deviceId: loggedInDevice && loggedInDevice.deviceId,
            deviceType: loggedInDevice && loggedInDevice.deviceType,
            userType: loggedInDevice && loggedInDevice.userType,
          }
          sendSocketNotification('loginCheck-' + userId, content);
        }

        const checkLogin = await UserLogin.findOne({
          attributes: ['id'],
          where
        });

        if (checkLogin) {

          // Get All User Profile Data
          const userProfile = await UserProfile.findOne({
            attributes: [
              'profileId',
              'firstName',
              'lastName',
              'picture',
              'lat',
              'lng',
              'state',
              'city',
              'zipcode',
              'country',
              'preferredCurrency',
              'preferredLanguage',
              'preferredPaymentMethod',
              'paymentCustomerId',
              'cardLastFour',
              'cardToken',
              'walletBalance',
              'walletUsed',
              'experienceDescription',
              'preferredLat',
              'preferredLng',
              'preferredLocation',
              'preferredType',
              'isDocumentUploaded',
              'address'
            ],
            where: { userId },
            raw: true
          });

          const user = await User.findOne({
            attributes: [
              'id', 'email', 'isBan', 'phoneNumber', 'phoneDialCode', 'phoneCountryCode',
              'isActive', 'userStatus', 'userType',
            ],
            where: {
              id: userId,
              deletedAt: null
            },
            order: [[`createdAt`, `DESC`]],
            raw: true
          });

          const getPayout = await Payout.findOne({
            attributes: ['id', 'methodId'],
            where: {
              userId,
            },
            raw: true
          });

          let isPayout = (getPayout && getPayout.methodId && getPayout.methodId != '') ? true : false;

          if (userProfile && user && !user.isBan) {

            return {
              result: {
                userId: request.user.id,
                profileId: userProfile.profileId,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: user.email,
                picture: userProfile.picture,
                state: userProfile.state,
                city: userProfile.city,
                zipcode: userProfile.zipcode,
                country: userProfile.country,
                isBan: user.isBan,
                preferredCurrency: userProfile.preferredCurrency,
                preferredLanguage: userProfile.preferredLanguage,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,
                phoneDialCode: user.phoneDialCode,
                phoneCountryCode: user.phoneCountryCode,
                userStatus: user.userStatus,
                userType: user.userType,
                cardLastFour: userProfile.cardLastFour,
                cardToken: userProfile.cardToken,
                preferredPaymentMethod: userProfile.preferredPaymentMethod,
                walletBalance: (userProfile.walletBalance && userProfile.walletBalance.toFixed(2)) || 0,
                walletUsed: (userProfile.walletUsed && userProfile.walletUsed.toFixed(2)) || 0,
                isPayout,
                experienceDescription: userProfile.experienceDescription,
                preferredLat: userProfile.preferredLat,
                preferredLng: userProfile.preferredLng,
                preferredLocation: userProfile.preferredLocation,
                preferredType: userProfile.preferredType,
                isDocumentUploaded: userProfile.isDocumentUploaded,
                address: userProfile.address,
              },
              status: 200
            }
          } else {
            if (!userProfile) {
              return {
                status: 500,
                errorMessage: 'Oops! Something went wrong with your profile. Please contact support.'
              }
            } else {
              return {
                status: 500,
                errorMessage: 'Oops! Something went wrong! . Please contact support.'
              }
            }
          }
        } else {
          return {
            errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue.",
            status: 500
          };
        }
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

export default userAccount;

/*
query {
  userAccount {
    result {
      userId
      profileId
      firstName
      lastName
      email
      picture
      state
      city
      zipcode
      country
      licenceFront
      licenceBack
      isBan
      preferredCurrency
      preferredLanguage
      phoneNumber
      isActive
      phoneDialCode
      userStatus
      walletBalance
      walletUsed
      userType
        verification {
        id
        isEmailConfirmed
        isLicenseFrontVerified
        isLicenseBackVerified
      }
      vehicles{
        id
        vehicleRC
        vehicleInsurance
      }
    }
    status
    errorMessage
  }
}
*/
