import {
	GraphQLInt as IntType
} from 'graphql';
import { OrderItems, Orders } from '../../models';
import WholeOrdersType from '../../types/Orders/WholeOrdersType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const removeOrderItem = {

	type: WholeOrdersType,

	args: {
		subCategoryId: { type: IntType },
		orderId: { type: IntType },
	},

	async resolve({ request }, {
		subCategoryId,
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

				const cartItem = await OrderItems.findAll({
					where: {
						orderId,
					},
					raw: true
				});


				if (cartItem && cartItem.length > 1) {

					const deleteOrderItem = await OrderItems.destroy({
						where: {
							subCategoryId,
							orderId,
						}
					});

					return {
						status: deleteOrderItem ? 200 : 400,
						errorMessage: deleteOrderItem ? null : 'Something went wrong. Please try again.'
					};

				} else if (cartItem && cartItem.length === 1) {

					const deleteOrderItem = await OrderItems.destroy({
						where: {
							subCategoryId,
							orderId,
						}
					});

					const deleteOrder = await Orders.destroy({
						where: {
							id: orderId
						}
					})

					return {
						status: deleteOrder ? 200 : 400,
						errorMessage: deleteOrder ? null : 'Something went wrong. Please try again.'
					};

				} else {
					return {
						status: 400,
						errorMessage: 'Oops! Something went wrong!  Cart not found'
					};
				}

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

export default removeOrderItem;
