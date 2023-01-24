import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';
import { SubCategory, UserCategory } from '../models';

const SubCategoryResult = new ObjectType({
    name: 'ExploreSubCategoryResult',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
        description: { type: StringType },
        image: { type: StringType },
        categoryId: { type: IntType },
        status: { type: StringType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
        isUserSubCategory: {
            type: BooleanType,
            async resolve(data, { }, request) {
                let count = await UserCategory.count({
                    where: { mainCategoryId: data.categoryId, userId: request.user && request.user.id, subCategoryId: data.id },
                });
                return (count) ? true : false;
            },
        }
    },
});

const Category = new ObjectType({
    name: 'ExploreCategory',
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
        },
        isUserCategory: {
            type: BooleanType,
            async resolve(data, { }, request) {
                let count = await UserCategory.count({
                    where: { mainCategoryId: data.id, userId: request.user && request.user.id },
                });

                return (count) ? true : false;
            },
        }
    },
});

const CategoryType = new ObjectType({
    name: 'ExploreCategoryType',
    fields: {
        searchResults: { type: new List(Category) },
        popularResults: { type: new List(Category) },
        recentResults: { type: new List(Category) },
    },
});

const ExploreType = new ObjectType({
    name: 'ExploreType',
    fields: {
        result: {
            type: CategoryType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default ExploreType;