import PayoutWholeType from '../../types/PayoutWholeType';
import { Payout, User } from '../../models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getPayouts = {

    type: PayoutWholeType,

    async resolve({ request }) {
        try {
            if (request.user && !request.user.admin) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

                const userId = request.user.id;
                const userEmail = await User.findOne({
                    attributes: [
                        'email',
                        'isBan'
                    ],
                    where: {
                        id: userId
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                });
                
                if (userEmail && !userEmail.isBan) {
                    let payoutDetails = await Payout.findAll({
                        where: {
                            userId
                        }
                    });                    
                    return {
                        results: payoutDetails,
                        status: 200
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Oops! Something went wrong!  Please contact support.'
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }
    }
};

export default getPayouts;

/**

query getPayouts {
  getPayouts {
    id
    methodId
    userId
    payEmail
    address1
    address2
    city
    state
    country
    zipcode
    currency
    createdAt
    status
  }
}

**/