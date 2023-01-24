import { Threads } from '../../data/models';

export async function getThreadId(userId, partnerId, bookingId) {
    const thread = await Threads.findOne({
        attributes: ['id'],
        where: {
            userId,
            partnerId,
            bookingId
        },
        raw: true
    });
    return thread && thread.id;
}