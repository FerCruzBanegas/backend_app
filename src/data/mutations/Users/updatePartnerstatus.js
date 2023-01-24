import {
    GraphQLBoolean as BooleanType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';

import { User, Booking } from '../../models';

import UserAccountType from '../../types/userAccountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const updatePartnerstatus = {

    type: UserAccountType,

    args: {
        isActive: { type: new NonNull(BooleanType) },
        lat: { type: FloatType },
        lng: { type: FloatType }
    },

    async resolve({ request }, { isActive, lat, lng }) {
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
            
            let activeStatus;

            if (!isActive) activeStatus = 'inactive';

            const checkBooking = await Booking.findOne({
                attributes: ['id'],
                where: {
                    partnerId: request.user.id,
                    status: { $in: ['created', 'approved', 'arrived', 'reviewed', 'started'] }
                },
                raw: true
            });

            if (checkBooking) {
                return {
                    status: 400,
                    errorMessage: "Oops! You are active as a Service Provider with an ongoing service. Please complete the service request to go offline."
                };
            }

            const isUpdated = await User.update(
                {
                    isActive,
                    lat,
                    lng,
                    activeStatus
                },
                { where: { id: request.user.id } }
            );

            if (!isUpdated || isUpdated.includes(0)) {
                return {
                    status: 400,
                    errorMessage: "Unable to update the status."
                };
            }

            return { status: 200 };

        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong! ' + error,
                status: 400
            };
        }

    },
};

export default updatePartnerstatus;

/**
mutation updatePartnerstatus($isActive: Boolean!) {
  updatePartnerstatus(isActive: $isActive) {
    status
    errorMessage
  }
}
 */
