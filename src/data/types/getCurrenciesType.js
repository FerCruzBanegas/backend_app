import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLList as List,
    GraphQLInt as IntType,
} from 'graphql';


import CurrencyType from './CurrenciesType';

const getCurrencyType = new ObjectType({
    name:"AllCurrency",
    fields: {
        results: {
            type: new List(CurrencyType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});


export default getCurrencyType;