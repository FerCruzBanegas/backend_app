import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

import { User, Reviews } from '../models';

import UserType from './UserType';

const Profile = new ObjectType({
  name: 'userProfile',
  fields: {
    userId: {
      type: StringType,
    },
    userData: {
      type: UserType,
      async resolve(profile) {
        return await User.findOne({
          where: { id: profile.userId },
        });
      },
    },
    reviewsCount: {
      type: IntType,
      async resolve(profile) {
        return await Reviews.count({
          where: {
            userId: profile.userId
          }
        });
      }
    },
    profileId: {
      type: IntType,
    },
    firstName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    displayName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    picture: {
      type: StringType,
    },
    location: {
      type: StringType,
    },
    info: {
      type: StringType,
    },
    createdAt: {
      type: StringType,
    },
    experienceDescription: {
      type: StringType,
    },
    preferredLat: {
      type: FloatType
    },
    preferredLng: {
      type: FloatType
    },
    preferredLocation: {
      type: StringType
    },
    address: {
      type: StringType,
    },
    preferredType: {
      type: StringType
    },
    isDocumentUploaded: {
      type: BooleanType
    }
  },
});

export default Profile;
