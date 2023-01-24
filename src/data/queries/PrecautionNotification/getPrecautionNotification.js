// Models
import { PrecautionNotification } from "../../models";

//Types
import PrecautionNotificationCommonType from "../../types/PrecautionNotification/PrecautionNotificationCommonType";
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getPrecautionNotification = {

    type: PrecautionNotificationCommonType,

    async resolve({ request, response }) {
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

                const result = await PrecautionNotification.findOne({
                    where: { isEnabled: true, id: 1 }
                });

                return await {
                    status: !result ? 400 : 200,
                    errorMessage: !result ? 'No record found' : null,
                    result
                };
            }
            else {
                return {
                    status: 500,
                    errorMessage: 'It looks like you have not logged in with your account. Please login and continue.'
                };
            }
        }
        catch (error) {
            return {
                status: 400,
                errorMessage: "Oops! Something went wrong! " + error
            };
        }
    }
};

export default getPrecautionNotification;

/*
    query GetPrecautionNotification {
        getPrecautionNotification {
            status
            errorMessage
            result {
                id
                title
                description
                isEnabled
                imageName
            }
        }
    }
*/