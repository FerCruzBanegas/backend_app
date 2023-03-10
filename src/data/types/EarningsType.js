import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType
} from 'graphql';

const EarningsResultType = new ObjectType({
    name: 'EarningsResultType',
    fields: {
        startDate: { type: StringType },
        endDate: { type: StringType },
        totalCompletedBookings: { type: IntType },
        totalAcceptedBookings: { type: IntType },
        totalEarnings: { type: FloatType },
        currency: { type: StringType },
        totalDuration: { type: FloatType },
        weeklyCompletedBookings: { type: IntType },
        weeklyAcceptedBookings: { type: IntType },
        weeklyTotalEarnings: { type: FloatType },
        weeklyTotalDuration: { type: FloatType },
        weeklyTotaltips: { type: FloatType },
        totalTips: { type: FloatType },
    }
});

const EarningsType = new ObjectType({
    name: 'EarningsType',
    fields: {
        result: {
            type: EarningsResultType
        },
        status: { type: IntType },
        errorMessage: { type: StringType }
    },
});

export default EarningsType;
