
import {
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType
} from 'graphql';

import { OrderItems } from '../../models';
import { OrderItemsCommonType } from '../../types/Orders/OrderItemsType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getWorkLogHistory = {

	type: OrderItemsCommonType,

	args: {
		orderId: { type: new NonNull(IntType) },
	},

	async resolve({ request }, { orderId }) {
		try {

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const results = await OrderItems.findAll({
				where: {
					orderId
				},
				raw: true
			});

			return await {
				status: 200,
				results
			}

		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default getWorkLogHistory;