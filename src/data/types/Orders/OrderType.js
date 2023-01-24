import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLList as List,
	GraphQLBoolean as BooleanType,
	GraphQLFloat as FloatType,
} from 'graphql';
import { OrderItems, Category, BookingReviewImage } from '../../models';
import OrderItemsType from './OrderItemsType';
import BookingReviewImageType from './BookingReviewImageType';
import GetCategoryType from '../GetCategoryType';

const OrderType = new ObjectType({
	name: 'OrderType',
	fields: {
		id: {
			type: IntType
		},
		promoId: {
			type: IntType
		},
		userId: {
			type: StringType
		},
		status: {
			type: StringType
		},
		userServiceFee: {
			type: FloatType
		},
		subTotal: {
			type: FloatType
		},
		total: {
			type: FloatType
		},
		errorMessage: {
			type: StringType
		},
		isSpecialService: {
			type: BooleanType
		},
		specialServiceFare: {
			type: FloatType
		},
		specialServiceTotalFare: {
			type: FloatType
		},
		currency: {
			type: StringType
		},
		requestCurrency: {
			type: StringType
		},
		travellingPrice: {
			type: FloatType
		},
		orderItemsList: {
			type: new List(OrderItemsType),
			async resolve(orders) {
				let data = await OrderItems.findAll({
					where: { orderId: orders.id }
				});

				if (data && data.length > 0) {
					await Promise.all(
						data.map((item, key) => {
							item.requestCurrency = orders.requestCurrency;
						})
					);
				}
				
				return data;
			}
		},
		categoryDetails: {
			type: GetCategoryType,
			async resolve(orders) {
				let data = await Category.findOne({
					where: { id: orders.categoryId },
				});

				data.requestCurrency = orders.requestCurrency;
				return data;
			},
		},
		reviewImage: {
			type: new List(BookingReviewImageType),
			async resolve(orders) {
				return await BookingReviewImage.findAll({
					where: { orderId: orders.id },
				});
			},
		}

	}
});

export default OrderType;