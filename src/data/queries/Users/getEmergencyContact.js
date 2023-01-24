import { EmergencyContact } from '../../models';

import { EmergencyContactCommonType } from '../../types/EmergencyContactType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getEmergencyContact = {

    type: EmergencyContactCommonType,

    async resolve({ request }, { }) {
        try {
            let errorMessage;
            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: 'Oops! it looks like you are not logged in with your account. Please login and continue.'
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            let results = await EmergencyContact.findAll({ where: { userId: request.user.id } });

            if (!results) errorMessage = 'Oops! Something went wrong';
            else if (results.length === 0) errorMessage = 'Oops! No emergency contacts found';

            return {
                status: !errorMessage ? 200 : 400,
                results,
                errorMessage
            };

        }
        catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }
    },
};

export default getEmergencyContact;

/**
query getEmergencyContact {
    getEmergencyContact {
        status
        errorMessage
        results {
                id
                userId
                contactName
                phoneNumber
        }
    }
}
 */
