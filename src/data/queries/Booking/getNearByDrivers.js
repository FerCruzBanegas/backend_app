import { Location, Pricing, SiteSettings } from '../../models';
import NearestDriversType from '../../types/NearestDriversType';
import sequelize from '../../sequelize';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

import {
	GraphQLFloat as FloatType
} from 'graphql';


const getNearestDrivers = {

	type: NearestDriversType,

	args: {
		latVal: { type: FloatType },
		lngVal: { type: FloatType },
	},

	async resolve({ request }, { latVal, lngVal }) {

		try {
			if (request.user) {
				let userId = request.user && request.user.id;

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				const getSiteSettings = await SiteSettings.findAll({
					attributes: ['name', 'value'],
					where: {
						name: {
							$in: ['allowableDistace']
						}
					},
					raw: true
				});

				let allowableDistance = getSiteSettings && getSiteSettings.find((o) => o.name === 'allowableDistace');


				let requestLocationPoint = sequelize.fn('ST_GeomFromText', `POINT(${latVal} ${lngVal})`);

				let contains = sequelize.fn('ST_CONTAINS',
					sequelize.col(`geometryCoordinates`),
					requestLocationPoint
				);

				const permittedLocations = await Location.findAll({
					attributes: ['id'],
					where: {
						isActive: true,
						and: sequelize.where(contains, 1)
					},
					raw: true,
					order: [['id', 'DESC']],
				});

				if (permittedLocations && permittedLocations.length > 0) {
					let permittedLocationsId = permittedLocations.map(x => { return x['id'] });

					const permittedCategories = await Pricing.findAll({
						attributes: ['categoryId', 'subCategoryId'],
						where: {
							isActive: true,
							locationId: {
								$in: permittedLocationsId
							}
						},
						order: [['id', 'DESC']],
						raw: true
					});

					if (permittedCategories && permittedCategories.length > 0) {
						let categoryId = permittedCategories.map(x => { return x['categoryId'] });
						let subCategoryId = permittedCategories.map(x => { return x['subCategoryId'] });
						categoryId = new Set(categoryId);
						subCategoryId = new Set(categoryId);
						categoryId = [...categoryId];
						subCategoryId = [...subCategoryId];

						const result = await sequelize.query(`

											SELECT
                        *,
                        (
                          6371 *
                          acos(
                              cos( radians( ${latVal} ) ) *
                              cos( radians( lat ) ) *
                              cos(
                                  radians( lng ) - radians( ${lngVal} )
                              ) +
                              sin(radians( ${latVal} )) *
                              sin(radians( lat ))
                          )
                        ) AS distance  FROM 
                            User JOIN UserCategory ON User.id = UserCategory.userId  
													WHERE 
                            (
                                User.isActive=true
                            ) AND (
                                User.isBan=false
                            ) AND (
                                User.userType=2
                            ) AND (
                                User.userStatus='active'
                            ) AND (
                                User.activeStatus="inactive"
                            ) AND (    
                                User.deletedAt IS NULL
                            ) AND ( 
                                User.updatedAt >= "${new Date(Date.now() - 5 * 60000).toISOString().slice(0, 19).replace('T', ' ')}"
                            ) AND (
                                User.id NOT IN(SELECT partnerId FROM BookingHistory WHERE userId="${userId}" AND status IN('declined', 'cancelledByPartner') AND updatedAt BETWEEN "${new Date(Date.now() - 1 * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")
                            ) AND (
								UserCategory.mainCategoryId IN(${categoryId})
							) AND (
                                User.id != "${userId}"    
                            ) AND (
                                6371 *
                                acos(
                                    cos( radians( ${latVal} ) ) *
                                    cos( radians( lat ) ) *
                                    cos(
                                        radians( lng ) - radians( ${lngVal} )
                                    ) +
                                    sin(radians( ${latVal} )) *
                                    sin(radians( lat ))
                                )
                            ) < ${allowableDistance.value}
                            ORDER BY distance ASC LIMIT 50
                        `, {
							type: sequelize.QueryTypes.SELECT
						});

						let nearByDrivers = [];

						categoryId.map((o, i) => {
							let categoryData = {};
							categoryData['id'] = o;
							categoryData['location'] = result.filter(obj => obj.mainCategoryId === o);
							nearByDrivers.push(categoryData);
						});

						nearByDrivers = nearByDrivers.sort((a, b) => a['id'] - b['id']);

						return await {
							status: 200,
							result: nearByDrivers
						};
					} else {
						return {
							status: 400,
							errorMessage: 'Sorry, our service unavailable in your location.'
						};
					}
				} else {
					return {
						status: 400,
						errorMessage: 'Sorry, our service unavailable in your location.'
					};
				}
			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				}
			}
		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	},
};

export default getNearestDrivers;

/*

query getNearestDrivers($latVal:Float,$lngVal:Float){
	getNearestDrivers(latVal:$latVal,lngVal:$lngVal){
		status
		result{
			id
			location { 
				lat
				lng
			}
		}
		errorMessage
	}
}


*/
