import {
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType
} from 'graphql';

import { ThreadItems } from '../../models';
import ThreadItemsCommonType from '../../types/Thread/ThreadItemsCommonType';

import { getThreadId } from '../../../helpers/Thread/getThreadId';
import { getUsers, getUserDetails } from '../../../helpers/Thread/getUsers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getAllThreadItems = {

  type: ThreadItemsCommonType,

  args: {
    bookingId: { type: new NonNull(IntType) },
    currentPage: { type: IntType }
  },

  async resolve({ request }, { bookingId, currentPage }) {
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

      let limit = 20, offset = 0;

      if (currentPage) offset = (currentPage - 1) * limit;

      const { userId, partnerId, user } = await getUsers(bookingId, request.user.id);

      if (!userId || !partnerId || !user) { //UserId check is added to find, if neither userId nor partnerId requested.
        return {
          status: 400,
          errorMessage: 'Oops! Unable to find your user profile. Please logout and try again.'
        };
      }

      const userDetails = await getUserDetails(user);

      const threadId = await getThreadId(userId, partnerId, bookingId);

      const count = await ThreadItems.count({ where: { threadId } });

      const threadItems = await ThreadItems.findAll({
        where: { threadId },
        offset,
        limit,
        order: [[`createdAt`, `DESC`]],
        raw: true
      });

      return {
        status: 200,
        count,
        result: {
          threadItems,
          userDetails,
          currentPage
        }
      };
    } catch (error) {
      return {
        status: 400,
        errorMessage: "Oops! Something went wrong! " + error
      };
    }
  }
};

export default getAllThreadItems;

/**
query getAllThreadItems($bookingId: Int!, $currentPage: Int) {
  getAllThreadItems(bookingId: $bookingId, currentPage: $currentPage) {
    status
    errorMessage
    result {
      threadItems {
        id
        threadId
        isRead
        authorId
        userId
        message
        createdAt
        updatedAt
      }
      userDetails {
        id
        email
        profile {
          firstName
          picture
        }
      }
      currentPage
    }
    count
  }
}
 */