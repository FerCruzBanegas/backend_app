import {
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
    GraphQLString as StringType
} from 'graphql';

const ScheduleBookingType = new ObjectType({
    name: 'ScheduleBookingType',
    fields: {
        id: {
            type: IntType,
        },
        bookingId: {
            type: IntType
        },
        status: {
            type: StringType
        },
        scheduleFrom: {
            type: StringType
        },
        scheduleTo: {
            type: StringType
        }
    }
});

export default ScheduleBookingType;