import { OrderItems, Category, Location, Pricing, CurrencyRates, UserCategory } from '../../../models';
import sequelize from '../../../../data/sequelize';
import { getCurrencyRates } from '../../../../helpers/booking/commonHelpers';
import { convert } from '../../../../helpers/currencyConvertion';

export async function calculateSubTotal(orderId, userLocationDetails, requestCurrency, partnerId) {
	try {
		let subTotal = 0, pricingData = [], permittedLocationsId = [];

		const { baseCurrency, rates } = await getCurrencyRates();

		const orderItems = await OrderItems.findAll({
			where: { orderId },
			raw: true
		});

		// Get Available Items
		let getCategoryId = orderItems.map((item) => { return item.categoryId });
		let getSubCategoryId = orderItems.map((item) => { return item.subCategoryId });
		let availableCategory = await Category.findOne({
			where: {
				id: {
					$in: getCategoryId
				},
				status: 'active',
			},
			raw: true
		});

		let convertCurrency = requestCurrency || userLocationDetails && userLocationDetails.preferredCurrency;

		let requestLocationPoint = sequelize.fn('ST_GeomFromText', `POINT(${userLocationDetails.preferredLat} ${userLocationDetails.preferredLng})`);

		let contains = sequelize.fn('ST_CONTAINS',
			sequelize.col(`geometryCoordinates`),
			requestLocationPoint
		);
		// Check the location is within the service available range
		const permittedLocations = await Location.findAll({
			attributes: ['id'],
			where: {
				isActive: true,
				and: sequelize.where(contains, 1)
			},
			order: [['id', 'DESC']],
			raw: true
		});

		if (permittedLocations && permittedLocations.length > 0) {
			permittedLocationsId = permittedLocations.map(x => { return x['id'] });

			// Find the pricing for the allowed location with the request category
			const pricingInfo = await Pricing.findAll({
				where: {
					isActive: true,
					locationId: {
						$in: permittedLocationsId
					},
					categoryId: availableCategory.id,
					subCategoryId: {
						$in: getSubCategoryId
					},
				},
				order: [
					['id', 'DESC']
				],
				raw: true
			});

			if (pricingInfo && pricingInfo.length > 0) {
				await Promise.all(pricingInfo.map(async data => {
					let orderData = orderItems.filter(order => order.subCategoryId === data.subCategoryId);
					let basePrice = data.basePrice;
					if (data.currency !== convertCurrency) {
						basePrice = convert(baseCurrency.currencyCode, rates, basePrice, data.currency, convertCurrency);
					}
					if (data.isPriceEditable && partnerId) {
						let userCategory = await UserCategory.findOne({
							attributes: ['basePrice', 'currency'],
							where: {
								userId: partnerId,
								mainCategoryId: orderData[0].categoryId,
								subCategoryId: orderData[0].subCategoryId
							},
							raw: true
						});

						if (userCategory && userCategory.basePrice && userCategory.basePrice > 0) {
							basePrice = userCategory.basePrice;
							if (userCategory.currency !== convertCurrency) {
								basePrice = convert(baseCurrency.currencyCode, rates, basePrice, userCategory.currency, convertCurrency);
							}
						}
					}

					pricingData.push({
						orderId,
						categoryId: orderData[0].categoryId,
						subCategoryId: orderData[0].subCategoryId,
						baseFare: basePrice,
						pricingId: data.id
					});
					if (availableCategory.pricingType === 'fixed') {
						subTotal = subTotal + (orderData[0].totalQuantity * basePrice)
					} else {
						subTotal = subTotal + (orderData[0].minimumHours * basePrice)
					}

				}));
			} else {
				return await {
					status: 400,
					errorMessage: "Sorry, our service unavailable in your location."
				}
			}

		} else {
			return await {
				status: 400,
				errorMessage: "Sorry, our service unavailable in your location."
			}
		}

		return await {
			status: 200,
			subTotalAmount: subTotal,
			availableCategory,
			pricingData
		};

	} catch (error) {
		return {
			status: 400,
			errorMessage: "Oops! Something went wrong! " + error
		};
	}
}