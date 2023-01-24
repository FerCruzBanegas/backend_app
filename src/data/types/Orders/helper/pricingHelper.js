import { Location, Pricing } from '../../../models';
import sequelize from '../../../../data/sequelize';

export async function pricingHelper(preferredLat, preferredLng, categoryId, subCategoryId) {
	try {

		let requestLocationPoint = sequelize.fn('ST_GeomFromText', `POINT(${preferredLat} ${preferredLng})`);

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
		let permittedLocationsId = permittedLocations.map(x => { return x['id'] });

		if (permittedLocations) {
			const pricingInfo = await Pricing.findAll({
				where: {
					isActive: true,
					locationId: {
						$in: permittedLocationsId
					},
					categoryId,
					subCategoryId
				},
				order: [['id', 'DESC']],
				raw: true
			});
			return pricingInfo && pricingInfo.length > 0 ? pricingInfo[0] : [];
		} else {
			return null;
		}

	} catch (error) {
		return {
			priceStatus: 400,
			priceErrorMessage: "Oops! Something went wrong! " + error
		};
	}
}