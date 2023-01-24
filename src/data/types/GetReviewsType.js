import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';


import ReviewsType from './ReviewsType';

const getReviewsType = new ObjectType({
    name: "GetReviewsType",
    fields: {
        results: {
            type: new List(ReviewsType)
        },
        result: {
            type: ReviewsType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});


export default getReviewsType;