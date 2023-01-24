import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLInt as IntType
} from 'graphql';


const WorkHistoryType = new ObjectType({
	name: 'WorkHistoryType',
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
		createdAt: {
			type: StringType
		}
	}
});

export default WorkHistoryType;