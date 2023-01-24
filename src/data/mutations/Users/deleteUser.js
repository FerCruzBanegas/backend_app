import { User, Booking } from '../../models';
import UserCommonType from '../../types/UserCommonType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';

const deleteUser = {
    type: UserCommonType,

    async resolve({ request }) {
        try {
            let userId;

            if (request.user && request.user.id) {

                userId = request.user.id;

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const booking = await Booking.findOne({
                    attributes: ['id'],
                    where: {
                        $and: [
                            { $or: [{ userId }, { partnerId: userId }] },
                            {
                                $or: [{
                                    status: { $in: ['created', 'started', 'approved', 'arrived', 'reviewed', 'scheduled'] }
                                }
                                ]
                            }
                        ]
                    }
                });

                if (booking) {
                    return {
                        status: 400,
                        errorMessage: 'It seems you have an active job/job request, please cancel or complete the job/job request in order to delete your account. Contact Support if you need any help on this.'
                    };
                }

                const deletedUser = await User.update({
                    deletedAt: new Date(),
                    deletedBy: userId
                }, {
                    where: {
                        id: userId
                    }
                });

                if (deleteUser) {
                    const errorThrow = 'Oops! We are unable to find your account. Please contact support for help.';
                    sendSocketNotification('loginCheck-' + userId, { userId }, errorThrow);
                }

                return await {
                    status: deletedUser ? 200 : 400,
                    errorMessage: deletedUser ? null : "Something went wrong! Please try again or please contact our support team."
                }

            } else {
                return {
                    status: 500,
                    errorMessage: "Please login with your account and continue."
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong. ' + error
            };
        }
    }
};

export default deleteUser;