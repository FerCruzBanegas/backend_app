import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType
} from 'graphql';
import {
	User,
	SMSVerification,
	UserProfile,
	UserLogin
} from '../../models';
import VerifyPhoneNumberType from '../../types/VerifyPhoneNumberType';
import { createJWToken } from '../../../libs/auth';
import {
	createUserLogin,
} from '../../../helpers/userLogin/userLogin';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import addOrder from '../../../libs/addOrderRequest';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const verifyPhoneNumber = {

	type: VerifyPhoneNumberType,

	args: {
		phoneDialCode: { type: new NonNull(StringType) },
		phoneNumber: { type: new NonNull(StringType) },
		verificationCode: { type: new NonNull(IntType) },
		deviceId: { type: new NonNull(StringType) },
		deviceType: { type: new NonNull(StringType) },
		userType: { type: IntType },
		preferredLanguage: { type: StringType },
		categoryId: { type: IntType },
		subCategoryId: { type: IntType },
		totalQuantity: { type: IntType },
		minimumHours: { type: FloatType },
		currency: { type: StringType },
	},

	async resolve({ request }, {
		phoneDialCode,
		phoneNumber,
		verificationCode,
		deviceId,
		deviceType,
		userType,
		preferredLanguage,
		categoryId,
		subCategoryId,
		totalQuantity,
		minimumHours,
		currency
	}) {

		try {
			let checkUserType, registerUserType, orderId, errorMessage;

			const isValidCode = await SMSVerification.findOne({
				attributes: ['id'],
				where: {
					phoneNumber,
					phoneDialCode,
					otp: verificationCode,
					userType
				}
			});

			if (isValidCode) {
				const isUserExist = await User.findOne({
					attributes: ['id', 'email', 'userType', 'isActive', 'userTypeUpdatedAt'],
					where: {
						phoneNumber,
						phoneDialCode,
						deletedAt: null
					}
				});

				if (isUserExist) {

					const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(isUserExist.id); // Check user ban or deleted status
					if (userStatusErrorMessage) {
						return {
							status: userStatusError,
							errorMessage: userStatusErrorMessage
						};
					}

					let userToken = await createJWToken(isUserExist.id, isUserExist.email, phoneNumber);

					let loggedInDevice = await UserLogin.findOne({
						attributes: ['userId', 'deviceType', 'deviceId', 'userType'],
						where: {
							userId: isUserExist.id,
							userType
						},
						raw: true
					});

					if (loggedInDevice) {
						let content = {
							auth: userToken,
							userId: loggedInDevice && loggedInDevice.userId,
							deviceId: loggedInDevice && loggedInDevice.deviceId,
							deviceType: loggedInDevice && loggedInDevice.deviceType,
							userType: loggedInDevice && loggedInDevice.userType,
						}
						sendSocketNotification('loginCheck-' + isUserExist.id, content);
					}

					checkUserType = isUserExist && isUserExist.userType;
					registerUserType = checkUserType == 1 ? 'user' : 'partner';

					if (userType != checkUserType) {
						if (checkUserType == 1 && !isUserExist.userTypeUpdatedAt) {
							let changeStatus = await User.update({
								userType: 2,
								userStatus: 'pending',
								userTypeUpdatedAt: new Date()
							}, {
								where: {
									id: isUserExist.id
								}
							});

						}
					}

					await createUserLogin(userToken, isUserExist.id, deviceId, deviceType, userType, isUserExist.isActive);

					if (preferredLanguage && preferredLanguage.toString() !== '') { // Update user preferred language
						const updateUserLanguage = await UserProfile.update({
							preferredLanguage
						}, {
							where: {
								userId: isUserExist.id
							},
						});
					}

					const userData = await UserProfile.findOne({
						attributes: ['preferredCurrency'],
						where: {
							userId: isUserExist.id

						}
					})

					currency = currency || userData.preferredCurrency;

					if (categoryId && subCategoryId && currency && userType === 1) { // User - addOrder
						const addOrderRequest = await addOrder({
							categoryId,
							subCategoryId,
							totalQuantity,
							minimumHours,
							currency,
							userToken
						});
						if (addOrderRequest && addOrderRequest.addOrder && addOrderRequest.addOrder.status === 200) {
							orderId = addOrderRequest.addOrder && addOrderRequest.addOrder.result && addOrderRequest.addOrder.result.orderId;
						} else {
							errorMessage = addOrderRequest.addOrder && addOrderRequest.addOrder.errorMessage || 'Oops! Something went wrong. Please try again.';
						}
					}

					return await {
						status: 200,
						errorMessage,
						result: {
							auth: userToken,
							email: isUserExist.email,
							userId: isUserExist.id,
							phoneNumber,
							phoneDialCode,
							orderId
						}
					};
				} else {
					return {
						status: 200,
						result: {
							auth: '',
							email: '',
							userId: '',
							phoneNumber,
							phoneDialCode
						}
					}
				}
			} else {
				return {
					errorMessage: 'Unable to validate your phone number',
					status: 400
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

export default verifyPhoneNumber;

/**
mutation verifyPhoneNumber($phoneDialCode: String!, $phoneNumber: String!, $verificationCode: Int!, $deviceId: String!, $deviceType: String!, $userType: Int, $preferredLanguage: String) {
	verifyPhoneNumber(phoneDialCode: $phoneDialCode, phoneNumber: $phoneNumber, verificationCode: $verificationCode,deviceId: $deviceId, deviceType: $deviceType, userType: $userType, preferredLanguage: $preferredLanguage) {
		status
		errorMessage
		result {
				auth
				email
				userId
				phoneNumber
				phoneDialCode
		}
	}
}
 */
