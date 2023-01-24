import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType
} from 'graphql';
import { OrderItems, Orders, SubCategory, SiteSettings, Booking } from '../../models';
import WholeOrdersType from '../../types/Orders/WholeOrdersType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';
import { checkAllowableServices } from './helper/checkAllowableServices';

const addOrder = {

	type: WholeOrdersType,

	args: {
		categoryId: { type: new NonNull(IntType) },
		subCategoryId: { type: new NonNull(IntType) },
		totalQuantity: { type: IntType },
		minimumHours: { type: FloatType },
		currency: { type: new NonNull(StringType) },
	},

	async resolve({ request }, {
		categoryId,
		subCategoryId,
		totalQuantity,
		minimumHours,
		currency,
	}) {
		try {
			let userId, orderId, status, errorMessage;

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			}

			userId = request.user.id;

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const itemDetail = await SubCategory.findOne({
				attributes: ['id'],
				where: {
					id: subCategoryId,
					status: 'active'
				},
				raw: true
			});

			if (!itemDetail) {
				return {
					status: 400,
					errorMessage: 'Oops! the service is not available at the moment.'
				};
			}

			const existingOrderedBucket = await Orders.findOne({
				attributes: ['id'],
				where: {
					userId,
					status: 'pending'
				},
				raw: true
			});

			const bookingData = await Booking.findOne({
				attributes: ['id'],
				where: {
					orderId: existingOrderedBucket && existingOrderedBucket.id
				},
				raw: true
			});

			if (existingOrderedBucket && !bookingData) {
				orderId = existingOrderedBucket.id;

				const allowedServices = await SiteSettings.findOne({
					attributes: ['name', 'value'],
					where: {
						name: 'allowedServices'
					},
					raw: true
				});

				const { serviceStatus, serviceErrorMessage } = await checkAllowableServices(orderId, allowedServices.value);
				if (serviceStatus != 200) {
					return await {
						status: serviceStatus,
						errorMessage: serviceErrorMessage
					};
				}

				const existingOrders = await OrderItems.findOne({
					attributes: ['id', 'categoryId'],
					where: {
						orderId,
					},
					raw: true
				});

				if (existingOrders && existingOrders.categoryId != categoryId) {
					return {
						status: 400,
						errorMessage: 'Oops! You are trying to book different category. Please clear the cart and try again.'
					};
				}

				const existingOrderedItem = await OrderItems.findOne({
					attributes: ['id', 'categoryId'],
					where: {
						orderId,
						categoryId,
						subCategoryId
					},
					raw: true
				});

				if (existingOrderedItem) { // If the chosen item already updated to the cart
					const updateExistingOrderedItem = await OrderItems.update({
						totalQuantity,
						minimumHours,
						currency
					}, {
						where: {
							subCategoryId,
							orderId,
						}
					});

					status = updateExistingOrderedItem ? 200 : 400;
					errorMessage = updateExistingOrderedItem ? null : 'Oops! Something went wrong. Unable to update your order and please try again.';

				} else { // New item add to the cart

					const createOrderItem = await OrderItems.create({
						orderId,
						categoryId,
						subCategoryId,
						totalQuantity,
						minimumHours,
						currency
					});

					status = createOrderItem ? 200 : 400;
					errorMessage = createOrderItem ? null : 'Oops! Something went wrong. Unable to update your order and please try again.';
				}
			} else { // Create a new order with a order item

				const createNewOrder = await Orders.create({
					userId,
					status: 'pending',
					orderItems: {
						orderId,
						categoryId,
						subCategoryId,
						minimumHours,
						totalQuantity,
						currency
					},
				}, {
					include: [
						{ model: OrderItems, as: 'orderItems' },
					]
				});

				status = createNewOrder ? 200 : 400;
				errorMessage = createNewOrder ? null : 'Oops! Something went wrong. Please try again.';
			}

			return {
				status,
				errorMessage,
				result: {
					id: orderId
				}
			};

		} catch (err) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + err
			};
		};

	},
};

export default addOrder;
