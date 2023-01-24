import {
    User
} from '../../data/models';

export default async function checkUserBanStatus(id) {
    let userStatusErrorMessage, userStatusError;
    const userStatus = await User.findOne({
        attributes: ['id', 'isBan', 'deletedAt'],
        where: {
            id
        },
        raw: true
    });

    if (userStatus && userStatus.isBan) {
        userStatusErrorMessage = 'Oops! It looks like your account is disabled at the moment. Please contact our support.';
        userStatusError = 500;
    } else if (userStatus && userStatus.deletedAt) {
        userStatusErrorMessage = 'Oops! We are unable to find your account. Please contact support for help.';
        userStatusError = 500;
    }

    return await {
        isBan: userStatus && userStatus.isBan,
        deletedAt: userStatus && userStatus.deletedAt,
        userStatusErrorMessage,
        userStatusError
    };
}