import {
	GraphQLInt as IntType,
} from 'graphql';
import { Orders, OrderItems, Booking } from '../../models';
import WholeOrdersType from '../../types/Orders/WholeOrdersType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const clearOrderedItems = {

	type: WholeOrdersType,

	args: {
		orderId: { type: IntType },
	},

	async resolve({ request }, {
		orderId,
	}) {
		try {

			if (request.user) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				const orderExist = await Orders.findOne({
					where: {
						id: orderId,
						status: 'pending'
					},
					raw: true
				})

				const bookingData = await Booking.findOne({
					attributes: ['id'],
					where: {
						orderId
					},
					raw: true
				});

				if (!orderExist || bookingData) {
					return {
						status: 400,
						errorMessage: 'Cart not found'
					};
				}

				const orderItemDelete = await OrderItems.destroy({
					where: {
						orderId
					}
				});

				const orderDelete = await Orders.destroy({
					where: {
						id: orderId
					}
				})

				return {
					status: orderDelete ? 200 : 400,
					errorMessage: orderDelete ? null : 'Something went wrong. Please try again.'
				};

			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			};

		} catch (err) {
			return {
				status: 500,
				errorMessage: 'Oops! Something went wrong! ' + err
			};
		};

	},
};

export default clearOrderedItems;
