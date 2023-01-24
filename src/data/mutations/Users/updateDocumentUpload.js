import {
	GraphQLBoolean as BooleanType,
} from 'graphql';
import { UserProfile } from '../../models';
import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updateDocumentUpload = {

	type: UserAccountType,

	args: {
		isDocumentUploaded: { type: BooleanType }
	},

	async resolve({ request }, { isDocumentUploaded }) {

		try {

			if (!request.user) {
				return {
					errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue.",
					status: 500
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const updateIsDocumentUploaded = await UserProfile.update({
				isDocumentUploaded
			},
				{
					where: {
						userId: request.user.id
					}
				});

			return {
				status: updateIsDocumentUploaded ? 200 : 400,
				errorMessage: updateIsDocumentUploaded ? null : "Unable to update the location."
			};

		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}

	},
};

export default updateDocumentUpload;
