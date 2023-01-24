import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLFloat as FloatType,
	GraphQLList as List
} from 'graphql';

import { SubCategory, UserProfile, WorkHistory, WorkLogHistory, OrderSubCategory } from '../../models';
import GetSubCategoryType from '../GetSubCategoryType';
import WorkHistoryType from '../WorkHistoryType';
import WorkLogHistoryType from '../WorkLogHistoryType';

import { getCurrencyRates } from '../../../helpers/booking/commonHelpers'
import { convert } from '../../../helpers/currencyConvertion';
import { pricingHelper } from './helper/pricingHelper';
import getCommonType from '../../../helpers/getCommonType';

const OrderItemsType = new ObjectType({
	name: 'OrderItemsType',
	fields: {
		id: {
			type: IntType
		},
		categoryId: {
			type: IntType
		},
		subCategoryId: {
			type: IntType
		},
		orderId: {
			type: IntType
		},
		baseFare: {
			type: FloatType
		},
		minimumHours: {
			type: IntType
		},
		currency: {
			type: StringType
		},
		totalQuantity: {
			type: IntType
		},
		requestCurrency: {
			type: StringType
		},
		workedDuration: {
			type: FloatType,
			async resolve(data) {
				return data.workedDuration.toFixed(2)
			}
		},
		pausedDuration: {
			type: FloatType
		},
		startedAt: {
			type: StringType
		},
		completedAt: {
			type: StringType
		},
		convertBaseFare: {
			type: FloatType,
			async resolve(data) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertBaseFare = data.baseFare;
				if (data.requestCurrency !== data.currency) {
					convertBaseFare = convert(baseCurrency.currencyCode, rates, data.baseFare, data.currency, data.requestCurrency);
				}
				return convertBaseFare;
			}
		},
		subCategoryBasePrice: {
			type: FloatType,
			async resolve(data, { }, request) {
				let userId = (request && request.user) ? request.user.id : undefined;

				let userData = await UserProfile.findOne({
					attributes: ['preferredLat', 'preferredLng', 'preferredCurrency'],
					where: {
						userId
					}
				});

				let pricingInfo = await pricingHelper(userData.preferredLat, userData.preferredLng, data.categoryId, data.subCategoryId);
				const { baseCurrency, rates } = await getCurrencyRates();

				let amount = 0;

				if (pricingInfo) {
					if (pricingInfo.currency !== data.requestCurrency) {
						amount = convert(baseCurrency.currencyCode, rates, pricingInfo.basePrice, pricingInfo.currency, data.requestCurrency).toFixed(2);
					} else {
						amount = pricingInfo.basePrice;
					}
				};

				return amount;
			}
		},
		subCategoryTotal: {
			type: FloatType,
			async resolve(data, { }, request) {
				let userId = (request && request.user) ? request.user.id : undefined;

				let userData = await UserProfile.findOne({
					attributes: ['preferredLat', 'preferredLng', 'preferredCurrency'],
					where: {
						userId
					}
				});

				let pricingInfo = await pricingHelper(userData.preferredLat, userData.preferredLng, data.categoryId, data.subCategoryId);
				const { baseCurrency, rates } = await getCurrencyRates();
				let amount = 0;
				if (data.totalQuantity > 0) {
					amount = data.totalQuantity * pricingInfo.basePrice
				} else {
					amount = data.minimumHours * pricingInfo.basePrice;
					if (data.workedDuration > data.minimumHours) amount = pricingInfo.basePrice * data.workedDuration;
				}
				if (pricingInfo.currency !== data.requestCurrency) {
					amount = convert(baseCurrency.currencyCode, rates, amount, pricingInfo.currency, data.requestCurrency).toFixed(2);
				}
				return amount;
			}
		},
		totalBookingFare: {
			type: FloatType,
			async resolve(data) {
				let fare = 0;
				const { baseCurrency, rates } = await getCurrencyRates();

				if (data.totalQuantity > 0) {
					fare = data.totalQuantity * data.baseFare
				} else {
					fare = data.baseFare * data.minimumHours;
					if (data.workedDuration > data.minimumHours) fare = data.baseFare * data.workedDuration;
				}
				if (data.requestCurrency !== data.currency) {
					fare = convert(baseCurrency.currencyCode, rates, fare, data.currency, data.requestCurrency);
				}

				return fare.toFixed(2);
			}
		},
		multiplierValue: {
			type: FloatType,
			async resolve(data, { }, request) {
				let userId = (request && request.user) ? request.user.id : undefined;

				let userData = await UserProfile.findOne({
					attributes: ['preferredLat', 'preferredLng', 'preferredCurrency'],
					where: {
						userId
					}
				});

				let pricingInfo = await pricingHelper(userData.preferredLat, userData.preferredLng, data.categoryId, data.subCategoryId);

				let result = 0;
				if (pricingInfo) {
					result = pricingInfo.multiplierValue
				};

				return result;
			}
		},
		subCategoryDetails: {
			type: GetSubCategoryType,
			async resolve(data) {

				let result = [];

				result = await OrderSubCategory.findOne({
					where: {
						subCategoryId: data.subCategoryId,
						orderId: data.orderId
					},
				});

				if (!result) {
					result = await SubCategory.findOne({
						where: { id: data.subCategoryId },
					});
				}
				return result;
			},
		},
		workHistory: {
			type: new List(WorkHistoryType),
			async resolve(data) {
				return await WorkHistory.findAll({
					where: {
						orderItemId: data.id,
						orderId: data.orderId
					},
					order: [['createdAt', 'ASC']]
				});
			},
		},
		workHistoryStatus: {
			type: StringType,
			async resolve(data) {

				let status = 'pending';
				let result = await WorkHistory.findOne({
					attributes: ['status'],
					where: {
						orderItemId: data.id,
						orderId: data.orderId
					},
					order: [['createdAt', 'DESC']]
				});

				if (result) {
					if (result.status === 'started') {
						status = 'resumed';
					} else {
						status = result.status;
					}
				}

				return status;
			},
		},
		workLogHistory: {
			type: new List(WorkLogHistoryType),
			async resolve(data) {
				return await WorkLogHistory.findAll({
					where: {
						orderItemId: data.id,
						orderId: data.orderId
					},
					order: [['createdAt', 'ASC']]
				});
			},
		}
	}
});

export const OrderItemsCommonType = getCommonType('OrderItemsCommonType', OrderItemsType);

export default OrderItemsType;