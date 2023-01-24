import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';


const BookingReviewImageType = new ObjectType({
    name: 'BookingReviewImageType',
    fields: {
        id: {
            type: IntType
        },
        orderId: {
            type: IntType
        },
        imageName: {
            type: StringType
        }
    }
});

export default BookingReviewImageType;