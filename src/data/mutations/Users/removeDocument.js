import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';

import { UserDocument } from '../../models';
import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const removeDocument = {

    type: UserAccountType,

    args: {
        imageName: { type: NonNull(StringType) },
        type: { type: NonNull(StringType) },
    },

    async resolve({ request }, { imageName, type }) {

        try {

            if (request.user && request.user.id) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const removeUserDocument = await UserDocument.destroy({
                    where: {
                        userId: request.user.id,
                        imageName,
                        type
                    }
                });

                return {
                    status: 200
                };

            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
                }
            }

        } catch (error) {
            return {
                status: 400,
                error: `Oops! Something happened ${error}`
            };
        }
    }
};

export default removeDocument;