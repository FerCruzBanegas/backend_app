import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';
import OrderType from './OrderType';

const WholeOrdersType = new ObjectType({
    name: 'WholeOrdersType',
    fields: {
        status: { type: IntType },
        errorMessage: { type: StringType },
        result: { type: OrderType },
        results: { type: new List(OrderType) },
        count: { type: IntType }
    }
});

export default WholeOrdersType;  