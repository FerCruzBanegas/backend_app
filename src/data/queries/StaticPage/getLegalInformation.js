import { StaticPage } from '../../models';
import StaticPageCommonType from '../../types/StaticPage/StaticPageCommonType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const getLegalInformation = {

  type: StaticPageCommonType,

  async resolve({ request }, { }) {
    try {

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }
      
      const result = await StaticPage.findOne({ where: { id: 5 } });
      return await {
        status: result ? 200 : 400,
        errorMessage: result ? null : 'Oops! Unable to find the page. Try again.',
        result
      };
    }
    catch (error) {
      return {
        status: 400,
        errorMessage: 'Oops! Something went wrong.' + error
      }
    }
  }
};

export default getLegalInformation;

/*
query {
  getLegalInformation {
    status
    errorMessage
    result {
      id
      pageName
      metaTitle
      metaDescription
      pageBanner
      content
    }
  }
}
*/