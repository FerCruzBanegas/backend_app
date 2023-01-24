import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import getCommonType from '../../helpers/getCommonType';

const EmergencyContactType = new ObjectType({
    name: 'ContactType',
    fields: {
        id: { type: IntType },
        userId: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
        contactName: { type: new NonNull(StringType) },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    },
});

export const EmergencyContactCommonType = getCommonType('EmergencyContactCommonType', EmergencyContactType);

export default EmergencyContactType;
