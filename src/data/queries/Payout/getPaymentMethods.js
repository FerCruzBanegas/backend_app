import GetPaymentType from '../../types/GetPaymentType';
import { PaymentMethods } from '../../../data/models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getPaymentMethods = {

    type: GetPaymentType,

    async resolve({ request }) {
        try {

            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

                const getData = await PaymentMethods.findAll();

                if (getData) {
                    return {
                        results: getData,
                        status: 200
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: "Oops! Something went wrong! "
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.',
                };
            }

        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            }
        }
    }
};

export default getPaymentMethods;

/*
{
  getCountries{
    errorMessage
    status
    results{
      id
      isEnable
      countryCode
      countryName
      dialCode
    }
  }
}
*/