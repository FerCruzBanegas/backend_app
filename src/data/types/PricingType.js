import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
  GraphQLList as List,
} from 'graphql';

const PricingType = new ObjectType({
  name: 'PricingType',
  fields: {
    id: { type: IntType },
    locationId: { type: IntType },
    categoryId: { type: IntType },
    subCategoryId: { type: IntType },
    isActive: { type: BooleanType },
    currency: { type: StringType },
    isPriceEditable: { type: BooleanType },
    basePrice: { type: FloatType },
    convertBasePrice: { type: FloatType },
    multiplierValue: { type: FloatType },
    createdAt: { type: StringType },
    updatedAt: { type: StringType },
    userBasePrice: { type: FloatType },
    convertUserBasePrice: { type: FloatType },
  },
});


export default PricingType;