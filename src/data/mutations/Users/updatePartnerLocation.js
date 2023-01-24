import {
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType,
} from 'graphql';
import { User, UserLogin, Booking } from '../../models';
import UserAccountType from '../../types/userAccountType';

import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updatePartnerLocation = {

	type: UserAccountType,

	args: {
		lat: { type: new NonNull(FloatType) },
		lng: { type: new NonNull(FloatType) },
		bearing: { type: FloatType },
	},

	async resolve({ request }, { lat, lng, bearing }) {

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

				let userId = request.user.id;

				currentToken = request.headers.auth;
				where = {
					userId: request.user.id,
					key: currentToken
				};

				const checkLogin = await UserLogin.findOne({
					attributes: ['id'],
					where
				});

				if (checkLogin) {

					const updateDriverCurrentLocation = await User.update({
						lat,
						lng
					},
						{
							where: {
								id: userId
							}
						});

					if (updateDriverCurrentLocation) {

						const checkBooking = await Booking.findOne({
							attributes: ['id', 'partnerId', 'userId'],
							where: {
								partnerId: request.user.id,
								status: { $in: ['created', 'started', 'approved', 'arrived', 'reviewed'] }
							},
							raw: true
						});

						if (checkBooking) {

							let content = {
								userId: checkBooking.userId,
								partnerId: checkBooking.partnerId,
								bookingId: checkBooking.id,
								lat,
								lng,
								bearing
							};

							sendSocketNotification('partnerLocation-' + checkBooking.id, content);

						}

						return {
							status: 200
						};

					} else {
						return {
							status: 400,
							errorMessage: "Unable to update the location."
						};
					}

				} else {
					return {
						errorMessage: "You haven't authorized for this action.",
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

export default updatePartnerLocation;

/**
mutation updatePartnerLocation($lat: Float!, $lng: Float!) {
	updatePartnerLocation(lat: $lat, lng: $lng) {
		status
		errorMessage
	}
}
 */
