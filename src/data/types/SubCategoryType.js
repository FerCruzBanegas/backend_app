import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
    GraphQLBoolean as BooleanType
} from 'graphql';

import {
    Category,
    UserCategory
} from '../models';

import PricingType from './PricingType';
import GetCategoryType from './GetCategoryType';

const SubCategory = new ObjectType({
    name: 'SubCategory',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
        description: { type: StringType },
        image: { type: StringType },
        categoryId: { type: IntType },
        status: { type: StringType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
        requestCurrency: { type: StringType },
        pricingDetails: {
            type: PricingType
        },
        categoryDetails: {
            type: GetCategoryType,
            async resolve(data) {
                return await Category.findOne({
                    where: { id: data.categoryId },
                });
            },
        },
        isUserSubCategory: {
            type: BooleanType,
            async resolve(data, { }, request) {
                let count = await UserCategory.count({
                    where: { mainCategoryId: data.categoryId, userId: request.user.id, subCategoryId: data.id },
                });
                return (count) ? true : false;
            },
        }
    },
});


const SubCategoryType = new ObjectType({
    name: 'SubCategoryType',
    fields: {
        results: {
            type: new List(SubCategory)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default SubCategoryType;