import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';

import BookingType from './BookingType';

const BookingHistoryType = new ObjectType({
    name: 'TripsHistoryCommon',
    fields: {
        results: {
            type: new List(BookingType)
        },
        result: {
            type: BookingType
        },
        count: {
            type: IntType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export default BookingHistoryType;
