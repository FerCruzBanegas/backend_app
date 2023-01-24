import {
    GraphQLNonNull as NonNull,
    GraphQLString as StringType
} from 'graphql';

import { UserProfile } from '../../models';

import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updateUserProfile = {

    type: UserAccountType,

    args: {
        firstName: { type: new NonNull(StringType) },
        lastName: { type: new NonNull(StringType) }
    },

    async resolve({ request }, { firstName, lastName }) {
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

            const isUpdated = await UserProfile.update(
                {
                    firstName,
                    lastName
                },
                { where: { userId: request.user.id } }
            );

            if (!isUpdated || isUpdated.includes(0)) {
                return {
                    status: 400,
                    errorMessage: "Something went wrong. Please try again"
                };
            }

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

export default updateUserProfile;

/**
mutation updateUserProfile($firstName: String!, $lastName: String!) {
    updateUserProfile(firstName: $firstName, lastName: $lastName) {
        status
        errorMessage
    }
}
 */
