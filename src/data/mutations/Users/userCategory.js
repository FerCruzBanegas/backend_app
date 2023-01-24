import {
	GraphQLString as StringType,
	GraphQLInt as IntType
} from 'graphql';
import CategoryType from '../../types/CategoryType';
import { UserCategory } from '../../models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const userCategory = {

	type: CategoryType,

	args: {
		data: { type: StringType },
		categoryId: { type: IntType },
	},

	async resolve({ request }, { data, categoryId }) {

		try {
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

				let userId = request.user.id;
				let categoryList = JSON.parse(data);
				let updateList = [];

				if (categoryList && categoryList.length > 0) {
					updateList = await Promise.all(categoryList.map(async (items) => {
						return {
							id: items.id,
							userId,
							mainCategoryId: items.categoryId,
							subCategoryId: items.subCategoryId,
							basePrice: items.basePrice,
							currency: items.currency
						}
					}));
				}

				const removeCategoryList = await UserCategory.destroy({
					where: {
						userId,
						mainCategoryId: categoryId
					}
				});

				const bulkCreate = await UserCategory.bulkCreate(updateList);

				return {
					status: 200
				}

			} else {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'

				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Oops! something went wrong. ' + error
			}
		}
	},
};

export default userCategory;
