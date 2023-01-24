import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLList as List,
	GraphQLBoolean as BooleanType,
	GraphQLFloat as FloatType,
} from 'graphql';
import { SubCategory } from '../models';

const SubCategoryResult = new ObjectType({
	name: 'SubCategoryResult',
	fields: {
		id: { type: IntType },
		name: { type: StringType },
		description: { type: StringType },
		image: { type: StringType },
		categoryId: { type: IntType },
		status: { type: StringType },
		createdAt: { type: StringType },
		updatedAt: { type: StringType },
	},
});

const Category = new ObjectType({
	name: 'Category',
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
		subCategory: {
			type: new List(SubCategoryResult),
			async resolve(data) {
				return await SubCategory.findAll({
					where: { categoryId: data.id },
				});
			},
		}
	},
});


const CategoryType = new ObjectType({
	name: 'CategoryType',
	fields: {
		results: {
			type: new List(Category)
		},
		status: {
			type: IntType
		},
		errorMessage: {
			type: StringType
		}
	},
});

export default CategoryType;