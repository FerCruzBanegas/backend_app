import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';

import { UserProfile } from '../../models';

import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updateJobLocation = {

    type: UserAccountType,

    args: {
        preferredLat: { type: new NonNull(FloatType) },
        preferredLng: { type: new NonNull(FloatType) },
        preferredLocation: { type: new NonNull(StringType) },
        preferredType: { type: StringType },
    },

    async resolve({ request }, { preferredLat, preferredLng, preferredLocation, preferredType }) {
        try {
            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            await UserProfile.update(
                {
                    preferredLat,
                    preferredLng,
                    preferredLocation,
                    preferredType
                },
                { where: { userId: request.user.id } }
            );

            return { status: 200 };

        }
        catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }

    },
};

export default updateJobLocation;

/**
mutation updateJobLocation($preferredLat: Float!, $preferredLng: Float!, $preferredLocation: String!, $preferredType: String) {
  updateJobLocation(preferredLat: $preferredLat, preferredLng: $preferredLng, preferredLocation: $preferredLocation, preferredType: $preferredType) {
    status
    errorMessage
  }
}
 */