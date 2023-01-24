import {
	GraphQLString as StringType,
	GraphQLInt as IntType
} from 'graphql';

import { Category } from '../../../data/models';
import ExploreType from '../../types/ExploreType';
import sequelize from '../../../data/sequelize';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getCategories = {

	type: ExploreType,

	args: {
		search: { type: StringType },
		currentPage: { type: IntType },
	},

	async resolve({ request }, { search, currentPage }) {
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

			let userId = request.user && request.user.id

			let statusFilter = { status: 'active' }, popularFilter = { isPopular: true }, searchFilter = {}, recentFilter = {};

			let limit, offset = 0;
			if (currentPage) { // Pagination
				limit = 20;
				offset = (currentPage - 1) * limit;
			}

			if (search) searchFilter = { name: { $like: `%${search}%` } };

			let recentCategoryId = await sequelize.query(`SELECT DISTINCT categoryId, MAX(id) as maxId FROM Booking WHERE userId= '${userId}' AND status = 'completed' GROUP BY categoryId ORDER BY maxId DESC`, {
				type: sequelize.QueryTypes.SELECT
			});

			if (recentCategoryId && recentCategoryId.length > 0) {
				recentFilter = {
					id: {
						$in: recentCategoryId.map(item => item.categoryId)
					},
				};
			}

			const searchResults = await Category.findAll({
				attributes: [
					'id', 'name', 'description', 'logoImage', 'bannerImage', 'isPopular', 'isJobPhotoRequired', 'userServiceFeeType', 'userServiceFeeValue', 'partnerServiceFeeType', 'partnerServiceFeeValue', 'pricingType', 'status', 'travellingPrice', 'currency',
					[sequelize.literal(`(SELECT  COUNT(mainCategoryId) FROM UserCategory WHERE  mainCategoryId = Category.id AND userId= '${userId}')`), 'count'],
				],
				where: {
					$and: [
						statusFilter,
						searchFilter,
					],
				},
				order: [[sequelize.literal('count'), 'DESC']],
				limit,
				offset
			});

			const popularResults = await Category.findAll({
				where: {
					$and: [
						statusFilter,
						popularFilter
					]
				},
				order: [['id', 'ASC']]
			});

			let recentResults = [];
			if (recentCategoryId && recentCategoryId.length > 0) {
				recentResults = await Category.findAll({
					where: {
						$and: [statusFilter, recentFilter],
					},
					order: sequelize.literal(`FIELD(id,${recentCategoryId.map(value => value.categoryId).toString()})`),
					limit: 5,
				});
			}

			return {
				status: 200,
				result: {
					searchResults,
					popularResults,
					recentResults
				}
			};

			// } else {
			// 	return {
			// 		status: 500,
			// 		errorMessage: 'You aren\'t authorized for this action.'
			// 	};
			// };
		}
		catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default getCategories;


// query getCategories($search: String, $currentPage: Int) {
// 	getCategories(search: $search, currentPage: $currentPage) {
// 		result {
// 			popularResults {
// 				id
// 				name
// 				description
// 				logoImage
// 				bannerImage
// 				isPopular
// 				isJobPhotoRequired
// 				userServiceFeeValue
// 				partnerServiceFeeValue
// 				pricingType
// 				status
// 				errorMessage
// 				createdAt
// 				updatedAt
// 				subCategory {
// 					id
// 					name
// 					description
// 					image
// 					categoryId
// 					status
// 					createdAt
// 					updatedAt
// 				}
// 			}
// 			searchResults {
// 				id
// 				name
// 				description
// 				logoImage
// 				bannerImage
// 				isPopular
// 				isJobPhotoRequired
// 				userServiceFeeValue
// 				partnerServiceFeeValue
// 				pricingType
// 				status
// 				errorMessage
// 				createdAt
// 				updatedAt
// 				isUserCategory
// 				subCategory {
// 					id
// 					name
// 					description
// 					image
// 					categoryId
// 					status
// 					createdAt
// 					updatedAt
// 					isUserSubCategory
// 				}
// 			}
// 			recentResults {
// 				id
// 				name
// 				description
// 				logoImage
// 				bannerImage
// 				isPopular
// 				isJobPhotoRequired
// 				userServiceFeeValue
// 				partnerServiceFeeValue
// 				pricingType
// 				status
// 				errorMessage
// 				createdAt
// 				updatedAt
// 				subCategory {
// 					id
// 					name
// 					description
// 					image
// 					categoryId
// 					status
// 					createdAt
// 					updatedAt
// 				}
// 			}
// 		}
// 		status
// 		errorMessage
// 	}
// }
