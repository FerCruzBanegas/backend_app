import {
	GraphQLInt as IntType,
	GraphQLString as StringType,
	GraphQLNonNull as NonNull
} from 'graphql';

import { BookingReviewImage } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const removeReviewImage = {

	type: BookingRequestType,

	args: {
		orderId: { type: new NonNull(IntType) },
		imageName: { type: NonNull(StringType) }
	},

	async resolve({ request }, { orderId, imageName }) {

		try {

			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				const removeReviewImages = await BookingReviewImage.destroy({
					where: {
						orderId,
						imageName,
					}
				});

				return {
					status: 200
				};

			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				}
			}

		} catch (error) {
			return {
				status: 400,
				error: `Oops! Something happened ${error}`
			};
		}
	}
};

export default removeReviewImage;