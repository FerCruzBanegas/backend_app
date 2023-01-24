import {
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import {
    Booking,
    ScheduleBooking,
    ScheduleBookingHistory,
    Orders
} from '../../models';

import BookingRequestType from '../../types/BookingRequestType';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const cancelScheduleBooking = {

    type: BookingRequestType,

    args: {
        bookingId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { bookingId }) {
        try {
            let userId;
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
                    attributes: ['id', 'status', 'orderId'],
                    where: {
                        id: bookingId,
                        userId,
                        status: 'scheduled'
                    },
                    raw: true
                });

                if (bookingData) {
                    // Update Booking Status
                    await Booking.update({
                        status: 'cancelledByUser'
                    }, {
                        where: {
                            id: bookingId
                        }
                    });
                    await Orders.update({
                        status: 'cancelled'
                    }, {
                        where: {
                            id: bookingData.orderId,
                        }
                    });
                    // Find the Schedule Booking data
                    const scheduledBookingData = await ScheduleBooking.findOne({
                        attributes: ['id', 'scheduleFrom', 'scheduleTo'],
                        where: {
                            bookingId,
                            userId
                        },
                        raw: true
                    });
                    // Update the Schedule booking data
                    await ScheduleBooking.update({
                        status: 'failed',
                    }, {
                        where: {
                            bookingId
                        }
                    });

                    if (scheduledBookingData) { // Create Schedule Booking History
                        await ScheduleBookingHistory.create({
                            bookingId,
                            scheduleId: scheduledBookingData.id,
                            status: 'failed',
                            scheduleFrom: scheduledBookingData.scheduleFrom,
                            scheduleTo: scheduledBookingData.scheduleTo
                        });
                    }

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

export default cancelScheduleBooking;

/*

mutation ($bookingId: Int!) {
    cancelScheduleBooking(bookingId: $bookingId) {
        status
        errorMessage
    }
}

*/