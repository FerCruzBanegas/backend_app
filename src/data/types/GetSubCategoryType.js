import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const GetSubCategoryType = new ObjectType({
    name: 'GetSubCategoryType',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
        description: { type: StringType },
        image: { type: StringType },
        categoryId: { type: IntType },
        status: { type: StringType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
        orderId: { type: IntType },
        subCategoryId: { type: IntType },
    },
});

export default GetSubCategoryType;
