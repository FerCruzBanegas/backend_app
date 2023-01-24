import { GraphQLInt as IntType } from 'graphql';
import { StaticPage } from '../../models';
import StaticPageCommonType from '../../types/StaticPage/StaticPageCommonType';
import checkUserBanStatus from '../../../helpers/userLogin/checkUserBanStatus';

const getStaticPageContent = {

    type: StaticPageCommonType,

    args: {
        id: { type: IntType }
    },

    async resolve({ request }, { id }) {
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

            const result = await StaticPage.findOne({
                where: {
                    id: id || 4 // Default Driver Privacy Policy
                }
            });

            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : 'Oops! Unable to find the page. Try again.',
                result
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong.' + error

            }
        }
    }
};

export default getStaticPageContent;

/*

query ($id: Int){
  getStaticPageContent(id: $id){
    status
    errorMessage
    result {
      id
      pageName
      metaTitle
      metaDescription
      pageBanner
      content
      createdAt
    }
  }
}

*/
