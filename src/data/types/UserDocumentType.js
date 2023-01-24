import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const UserDocumentType = new ObjectType({
    name: 'UserDocumentType',
    fields: {
        id: { type: IntType },
        imageName: { type: StringType },
        type: { type: StringType },
        userId: { type: StringType },
    },
});

export default UserDocumentType;