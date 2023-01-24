import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType
} from 'graphql';
import moment from 'moment';

import { Threads, ThreadItems } from '../../models';
import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { sendSocketNotification } from '../../../helpers/sendSocketNotification'
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { getUsers, getUserLang } from '../../../helpers/Thread/getUsers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';

const createThread = {

	type: ThreadItemsCommonType,

	args: {
		bookingId: { type: new NonNull(IntType) },
		message: { type: new NonNull(StringType) }
	},

	async resolve({ request }, { bookingId, message }) {
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

			if (!userId || !partnerId || !user) {
				return {
					status: 400,
					errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
				};
			}

			const thread = await Threads.findOrCreate({
				where: {
					bookingId,
					userId,
					partnerId
				},
				defaults: {
					bookingId,
					userId,
					partnerId
				},
				raw: true
			});

			let threadId = thread && thread[0] && thread[0].id;

			let threadItems = await ThreadItems.create({
				threadId,
				authorId: request.user.id,
				userId: user,
				message
			});

			const unReadUserCount = await ThreadItems.count({
				where: {
					threadId,
					userId,
					isRead: false
				}
			});

			const unReadPartnerCount = await ThreadItems.count({
				where: {
					threadId,
					userId: partnerId,
					isRead: false
				}
			});

			if (!threadItems || !threadItems.id) {
				return {
					status: 400,
					errorMessage: 'Oops! Unable to send a message and please try again.'
				};
			}

			const userProfileData = await getUserProfileData(userId);

			const partnerProfileData = await getUserProfileData(partnerId);

			threadItems = threadItems.dataValues;
			threadItems['unReadUserCount'] = unReadUserCount;
			threadItems['createdDate'] = moment(threadItems.createdAt).utc().unix();
			threadItems['unReadPartnerCount'] = unReadPartnerCount;
			const preferredLanguage = await getUserLang(user);
			threadItems['userPicture'] = userProfileData && userProfileData.picture;
			threadItems['partnerPicture'] = partnerProfileData && partnerProfileData.picture;
			threadItems['userPhoneNumber'] = userProfileData && userProfileData['user.phoneNumber'];
			threadItems['partnerPhoneNumber'] = partnerProfileData && partnerProfileData['user.phoneNumber'];
			threadItems['userDialCode'] = userProfileData && userProfileData['user.phoneDialCode'];
			threadItems['partnerDialCode'] = partnerProfileData && partnerProfileData['user.phoneDialCode'];
			threadItems['userName'] = userProfileData && userProfileData.firstName;
			threadItems['partnerName'] = partnerProfileData && partnerProfileData.firstName;
			threadItems['bookingId'] = bookingId;
			threadItems['senderName'] = (userId == request.user.id ? partnerProfileData && partnerProfileData.firstName : userProfileData && userProfileData.firstName);


			sendSocketNotification('newMessage-' + bookingId, threadItems);
			sendNotifications({ type: 'newMessage', requestContent: threadItems, userId: user, lang: preferredLanguage, userType: (userId == request.user.id ? 2 : 1) });

			return { status: 200 };

		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + error
			};
		}
	}
};

export default createThread;

/**
mutation createThread($bookingId: Int!, $message: String!) {
	createThread(bookingId: $bookingId, message: $message) {
		status
		errorMessage
	}
}
 */