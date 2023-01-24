import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType
} from 'graphql';


const WorkLogHistoryType = new ObjectType({
    name: 'WorkLogHistoryType',
    fields: {
        id: {
            type: IntType,
        },
        userId: {
            type: StringType,
        },
        bookingId: {
            type: IntType,
        },
        orderId: {
            type: IntType,
        },
        orderItemId: {
            type: IntType,
        },
        status: {
            type: StringType
        },
        startedAt: {
            type: StringType
        },
        closedAt: {
            type: StringType
        },
        totalDuration: {
            type: FloatType,
            async resolve(data) {
                return data.totalDuration.toFixed(2)
            }
        },
        createdAt: {
            type: StringType
        }
    }
});

export default WorkLogHistoryType;