import {
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType
} from 'graphql';

import { ThreadItems } from '../../models';
import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { getThreadId } from '../../../helpers/Thread/getThreadId';
import { getUsers } from '../../../helpers/Thread/getUsers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const readThread = {

	type: ThreadItemsCommonType,

	args: { bookingId: { type: new NonNull(IntType) } },

	async resolve({ request }, { bookingId }) {
		try {
			if (!request.user || !request.user.id) {
				return {
					status: 500,
					errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue."
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const { userId, partnerId, user } = await getUsers(bookingId, request.user.id);

			if (!userId || !partnerId || !user) { //UserId check is added to find, if neither user nor partner requested.
				return {
					status: 400,
					errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
				};
			}

			const threadId = await getThreadId(userId, partnerId, bookingId);

			if (!threadId) {
				return {
					status: 400,
					errorMessage: 'Sorry, no thread found!'
				};
			}

			await ThreadItems.update(
				{ isRead: true },
				{
					where: {
						threadId,
						userId: request.user.id
					}
				}
			);

			return { status: 200 };

		} catch (error) {
			return {
				status: 400,
				errorMessage: "Oops! Something went wrong! " + error
			};
		}
	}
};

export default readThread;

/**
mutation readThread($bookingId: Int!) {
	readThread(bookingId: $bookingId) {
		status
		errorMessage
	}
}
 */