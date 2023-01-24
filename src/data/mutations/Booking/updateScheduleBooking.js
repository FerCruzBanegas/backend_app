import moment from 'moment';
import {
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import {
    Booking,
    ScheduleBooking,
    ScheduleBookingHistory
} from '../../models';

import BookingRequestType from '../../types/BookingRequestType';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';
import { checkScheduleBookingDuration } from '../../../helpers/booking/scheduleBookingHelpers';

const updateScheduleBooking = {

    type: BookingRequestType,

    args: {
        bookingId: { type: new NonNull(IntType) },
        scheduleId: { type: new NonNull(IntType) },
        scheduleFrom: { type: new NonNull(IntType) },
        scheduleTo: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { bookingId, scheduleId, scheduleFrom, scheduleTo }) {
        try {
            let userId;
            let formattedScheduleFrom, formattedScheduleTo;
            if (request && request.user) {
                userId = request.user.id;

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const bookingData = await Booking.findOne({
                    attributes: ['id', 'status'],
                    where: {
                        id: bookingId,
                        userId,
                        status: 'scheduled'
                    },
                    raw: true
                });

                if (bookingData) {
                    if (scheduleFrom) {
                        formattedScheduleFrom = moment.unix(scheduleFrom).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
                        formattedScheduleTo = moment.unix(scheduleTo).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
                    }

                    const { status: eligibleStatus, errorMessage: eligibleErrorMessage } = await checkScheduleBookingDuration(formattedScheduleFrom);
                    if (eligibleStatus !== 200) {
                        return {
                            status: eligibleStatus,
                            errorMessage: eligibleErrorMessage
                        };
                    }
                    // Update the Schedule booking data
                    await ScheduleBooking.update({
                        scheduleFrom: formattedScheduleFrom,
                        scheduleTo: formattedScheduleTo
                    }, {
                        where: {
                            bookingId,
                            id: scheduleId,
                            userId
                        }
                    });
                    
                    // Create Schedule Booking History
                    await ScheduleBookingHistory.create({
                        bookingId,
                        scheduleId,
                        status: 'updated',
                        scheduleFrom: formattedScheduleFrom,
                        scheduleTo: formattedScheduleTo
                    });

                    return await {
                        status: 200
                    };
                } else {
                    return {
                        status: 400,
                        errorMessage: 'Oops! Something went wrong! Please close your application and try again.'
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login with your account and try again.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default updateScheduleBooking;