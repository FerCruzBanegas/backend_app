import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLList as List,
    GraphQLInt as IntType,
} from 'graphql';

import EmergencyContactType from './EmergencyContactType';

const responseContact = new ObjectType({
    name:"responseContact",
    fields: {
        results: {
            type: new List(EmergencyContactType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});


export default responseContact;
