import {
	GraphQLFloat as FloatType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLString as StringType,
} from 'graphql';
import { SubCategory, Pricing, UserCategory } from '../../../data/models';
import SubCategoryType from '../../types/SubCategoryType';
import { findPermittedLocation, findPricing } from '../../../helpers/booking/bookingHelpers';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers'
import { convert } from '../../../helpers/currencyConvertion';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getSubCategories = {

	type: SubCategoryType,

	args: {
		categoryId: { type: new NonNull(IntType) },
		lat: { type: FloatType },
		lng: { type: FloatType },
		requestCurrency: { type: StringType }
	},

	async resolve({ request }, { categoryId, lat, lng, requestCurrency }) {

		try {

			if (request.user) {
				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}
			}

			const { baseCurrency, rates } = await getCurrencyRates();

			let statusFilter = { status: 'active' }, categoryFilter = { categoryId }, locationFilter = {};
			let permittedLocations;
			if (lat && lng) {

				permittedLocations = await findPermittedLocation(lat, lng);

				if (!permittedLocations) {
					return {
						status: 400,
						errorMessage: 'Sorry, our service unavailable in your location.'
					};
				}

				const permittedCategories = await findPricing(categoryId, permittedLocations, [['subCategoryId', 'id']]);

				if (!permittedCategories || permittedCategories.length === 0) {
					return {
						status: 400,
						errorMessage: 'Sorry, our service unavailable in your location.'
					};
				}

				locationFilter = { $or: permittedCategories };

			}

			const results = await SubCategory.findAll({
				where: {
					$and: [
						statusFilter,
						categoryFilter,
						locationFilter
					]
				},
				order: [['id', 'ASC']]
			});

			// Pull the pricing & allowed category information based on available locations
			if (permittedLocations) {
				await Promise.all(results.map(async (data, index) => {
					let result = await Pricing.findAll({
						where: {
							isActive: true,
							locationId: {
								$in: permittedLocations
							},
							categoryId,
							subCategoryId: data.id
						},
						order: [['id', 'DESC']],
						raw: true,
					});

					let pricingResult = result && result.length > 0 && result[0];

					let convertBasePrice = pricingResult.basePrice;
					if (requestCurrency !== pricingResult.currency) {
						convertBasePrice = convert(baseCurrency.currencyCode, rates, pricingResult.basePrice, pricingResult.currency, requestCurrency);
					}

					pricingResult.convertBasePrice = convertBasePrice;

					results[index]['pricingDetails'] = pricingResult;

					if (pricingResult.isPriceEditable && request.user && request.user.id) {
						let userCategory = await UserCategory.findOne({
							attributes: ['basePrice', 'currency'],
							where: {
								userId: request.user.id,
								mainCategoryId: categoryId,
								subCategoryId: data.id
							},
							raw: true
						});

						if (userCategory && userCategory.basePrice > 0) {
							let convertUserBasePrice = userCategory.basePrice;
							results[index]['pricingDetails'].convertUserBasePrice = userCategory.basePrice;
							if (requestCurrency !== userCategory.currency) {
								convertUserBasePrice = convert(baseCurrency.currencyCode, rates, userCategory.basePrice, userCategory.currency, requestCurrency);
								results[index]['pricingDetails'].convertUserBasePrice = convertUserBasePrice;
							}
						}
					}

					results[index]['requestCurrency'] = requestCurrency;

				}));
			}

			return {
				results: results && results.length > 0 ? results : [],
				status: results && results.length > 0 ? 200 : 400,
				errorMessage: results && results.length > 0 ? null : "No record found."
			};
		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default getSubCategories;