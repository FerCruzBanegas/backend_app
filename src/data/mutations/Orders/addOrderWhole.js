import {
	GraphQLString as StringType
} from 'graphql';
import { OrderItems, Orders, SubCategory, SiteSettings, Booking } from '../../models';
import WholeOrdersType from '../../types/Orders/WholeOrdersType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const addOrderWhole = {

	type: WholeOrdersType,

	args: {
		cartList: { type: StringType }
	},

	async resolve({ request }, {
		cartList,
	}) {
		try {
			let userId, orderId, status, errorMessage, updateList = [], notExistingData = [];
			const cartListData = cartList && cartList.length > 0 ? JSON.parse(cartList) : [];

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				};
			}

			userId = request.user && request.user.id;

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			if (cartListData && cartListData.length > 0) {

				let differentCategory = cartListData.find(o => o && o.categoryId != cartListData[0].categoryId);

				if (differentCategory) {
					return {
						status: 400,
						errorMessage: 'Oops! You are trying to book different category. Please clear the cart and try again.'
					};
				}

				let getSubCategoryId = cartListData.map((item) => { return item.subCategoryId });

				const count = await SubCategory.count({
					where: {
						id: {
							$in: getSubCategoryId
						},
						status: 'active'
					},
					raw: true
				});

				if (count != cartListData.length) {
					return {
						status: 400,
						errorMessage: 'Oops! the service is not available at the moment.'
					};
				}

				const allowedServices = await SiteSettings.findOne({
					attributes: ['name', 'value'],
					where: {
						name: 'allowedServices'
					},
					raw: true
				});

				if (cartListData.length > allowedServices.value) {
					return await {
						status: 400,
						errorMessage: `Oops! Maximum ${allowedServices.value} services is allowed for a booking so kindly make another service request separately.`
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
				} else {
					const createNewOrder = await Orders.create({
						userId,
						status: 'pending'
					});
					orderId = createNewOrder.id;
				}

				updateList = await Promise.all(cartListData.map(data => {

					data.id && notExistingData.push(data.id)

					return {
						orderId,
						categoryId: data.categoryId,
						subCategoryId: data.subCategoryId,
						totalQuantity: data.totalQuantity,
						minimumHours: data.minimumHours,
						currency: data.currency,
						id: data.id
					}

				}));


				const removeOrderItems = await OrderItems.destroy({
					where: {
						orderId,
						id: {
							$notIn: [...notExistingData]
						}
					}
				});

				const bulkCreate = await OrderItems.bulkCreate(updateList, {
					updateOnDuplicate: ["id", "orderId", "categoryId", "subCategoryId", "totalQuantity", "minimumHours", "currency"]
				});

				status = bulkCreate ? 200 : 400;
				errorMessage = bulkCreate ? null : 'Oops! Something went wrong. Unable to update your order and please try again.';

				return {
					status,
					errorMessage,
					result: {
						id: orderId
					}
				};

			} else {
				return {
					status: 400,
					errorMessage: 'Empty cart!'
				}
			}

		} catch (err) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + err
			};
		};

	},
};

export default addOrderWhole;
