import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

import SavedLocationsType from './SavedLocationsType';

const SavedLocationsCommonType = new ObjectType({
    name: 'SavedLocationsCommonType',
    fields: {
        results: {
            type: new List(SavedLocationsType)
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});

export default SavedLocationsCommonType;
  