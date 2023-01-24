// GrpahQL
import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
} from 'graphql';

// Models
import {
	User,
	UserProfile,
	UserLogin,
	AdminUser
} from '../../models';

import UserCommonType from '../../types/UserCommonType';

// Helpers
import { createJWToken } from '../../../libs/auth';
import addOrder from '../../../libs/addOrderRequest';

const createUser = {
	type: UserCommonType,

	args: {
		firstName: { type: StringType },
		lastName: { type: StringType },
		email: { type: new NonNull(StringType) },
		phoneDialCode: { type: new NonNull(StringType) },
		phoneNumber: { type: new NonNull(StringType) },
		phoneCountryCode: { type: new NonNull(StringType) },
		lat: { type: FloatType },
		lng: { type: FloatType },
		city: { type: StringType },
		state: { type: StringType },
		zipcode: { type: StringType },
		country: { type: StringType },
		userType: { type: new NonNull(IntType) },
		deviceType: { type: new NonNull(StringType) },
		deviceDetail: { type: StringType },
		deviceId: { type: new NonNull(StringType) },
		preferredLanguage: { type: StringType },
		address: { type: StringType },
		preferredLat: { type: FloatType },
		preferredLng: { type: FloatType },
		preferredLocation: { type: StringType },
		categoryId: { type: IntType },
		subCategoryId: { type: IntType },
		totalQuantity: { type: IntType },
		minimumHours: { type: FloatType },
		currency: { type: StringType },
	},

	async resolve({ request, response }, {
		firstName,
		lastName,
		email,
		phoneDialCode,
		phoneNumber,
		phoneCountryCode,
		lat,
		lng,
		city,
		state,
		zipcode,
		country,
		userType,
		deviceType,
		deviceDetail,
		deviceId,
		preferredLanguage,
		address,
		preferredLat,
		preferredLng,
		preferredLocation,
		categoryId,
		subCategoryId,
		totalQuantity,
		minimumHours,
		currency,
	}) {
		try {

			let orderId, errorMessage;
			const checkUser = await User.findOne({
				attributes: ['id', 'email'],
				where: {
					$or: [
						{
							email
						},
						{
							phoneNumber,
							phoneDialCode
						}
					],
					deletedAt: null
				}
			});

			if (checkUser) {
				return {
					errorMessage: 'User already exists',
					status: 400
				};
			} else {
				const getAdminUserId = await AdminUser.findOne({
					where: {
						email
					},
				});

				if (getAdminUserId) {
					return {
						errorMessage: 'User already exists',
						status: 400
					};
				} else {
					let userStatus = (userType == 2) ? 'pending' : 'active';

					// New User Creation
					const newUser = await User.create({
						email,
						phoneNumber,
						phoneDialCode,
						phoneCountryCode,
						userType,
						userStatus,
						activeStatus: 'inactive',
						profile: {
							firstName,
							lastName,
							lat,
							lng,
							state,
							city,
							zipcode,
							country,
							preferredLanguage,
							address,
							preferredLat,
							preferredLng,
							preferredLocation
						}
					}, {
						include: [
							{ model: UserProfile, as: 'profile' },
						]
					});

					if (newUser) {
						let userToken = await createJWToken(newUser.id, newUser.email, phoneNumber);

						// Insert login token record with device infomation
						const creatUserLogin = await UserLogin.create({
							key: userToken,
							userId: newUser.id,
							deviceType,
							deviceDetail,
							deviceId,
							userType
						});

						let user = await UserProfile.findOne({
							where: {
								userId: newUser.id,
							},
							raw: true
						});

						if (categoryId && subCategoryId && currency && userType === 1) { // User - addOrder
							const addOrderRequest = await addOrder({
								categoryId,
								subCategoryId,
								totalQuantity,
								minimumHours,
								currency,
								userToken
							});

							if (addOrderRequest && addOrderRequest && addOrderRequest.status === 200) {
								orderId = addOrderRequest && addOrderRequest.result && addOrderRequest.result.orderId;
							} else {
								errorMessage = addOrderRequest && addOrderRequest.errorMessage || 'Oops! Something went wrong. Please try again.';
							}
						}

						return {
							result: {
								email: newUser.email,
								userId: newUser.id,
								phoneNumber: newUser.phoneNumber,
								userToken,
								user,
								orderId,
								userStatus,
								activeStatus: 'inactive',
								isActive: 0
							},
							status: 200,
						};
					} else {
						return {
							errorMessage: 'Oops! Unable to create the account.',
							status: 400
						}
					}
				}
			}
		} catch (error) {
			return {
				errorMessage: "Oops! Something went wrong! " + error,
				status: 400
			}
		}
	}

};

export default createUser;

/*
mutation (
		$firstName: String,
		$lastName: String,
		$email: String!,
		$phoneDialCode: String!,
		$phoneNumber: String!,
		$phoneCountryCode: String!,
		$lat: Float,
		$lng: Float,
		$city: String,
		$state:String,
		$zipcode: String,
		$country: String,
		$vehicleName: String,
		$vehicleType: Int,
		$vehicleNumber: String,
		$userType: Int!,
		$deviceType: String!,
		$deviceId: String!,
		$preferredLanguage: String
) {
		createUser (
				firstName: $firstName,
				lastName: $lastName,
				email: $email,
				phoneDialCode: $phoneDialCode,
				phoneNumber: $phoneNumber,
				phoneCountryCode: $phoneCountryCode,
				lat: $lat,
				lng: $lng,
				city: $city,
				state: $state,
				zipcode: $zipcode,
				country: $country,
				vehicleName: $vehicleName,
				vehicleType: $vehicleType,
				vehicleNumber: $vehicleNumber,
				userType: $userType,
				deviceType: $deviceType,
				deviceId: $deviceId,
				preferredLanguage: $preferredLanguage
		) {
				result {
						userId
						userToken
						user {
								firstName
								lastName
								phoneNumber
								preferredLanguage
								preferredCurrency
								status
								country
								createdAt
						}
				}
				status
				errorMessage
		}
}
*/