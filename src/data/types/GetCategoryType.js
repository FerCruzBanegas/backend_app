import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLBoolean as BooleanType,
	GraphQLFloat as FloatType,
} from 'graphql';
import { convert } from '../../helpers/currencyConvertion';
import { getCurrencyRates } from '../../helpers/booking/commonHelpers';

const GetCategoryType = new ObjectType({
	name: 'Categories',
	fields: {
		id: { type: IntType },
		name: { type: StringType },
		description: { type: StringType },
		logoImage: { type: StringType },
		bannerImage: { type: StringType },
		isPopular: { type: BooleanType },
		isJobPhotoRequired: { type: BooleanType },
		travellingPrice: { type: FloatType },
		userServiceFeeValue: { type: FloatType },
		partnerServiceFeeValue: { type: FloatType },
		pricingType: { type: StringType },
		currency: { type: StringType },
		status: { type: StringType },
		errorMessage: { type: StringType },
		createdAt: { type: StringType },
		updatedAt: { type: StringType },
		requestCurrency: {
			type: StringType
		},
		convertTravellingPrice: {
			type: FloatType,
			async resolve(orders) {
				const { baseCurrency, rates } = await getCurrencyRates();
				let convertTravellingPrice = orders.travellingPrice;
				if (orders.requestCurrency !== orders.currency) {
					convertTravellingPrice = convert(baseCurrency.currencyCode, rates, orders.travellingPrice, orders.currency, orders.requestCurrency);
				}

				return convertTravellingPrice;
			}
		},
	},
});

export default GetCategoryType;