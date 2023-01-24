import { Booking, User, UserProfile } from '../../data/models';

export async function getUsers(id, requestUserId) {

	const bookingData = await Booking.findOne({
		attributes: ['partnerId', 'userId'],
		where: { id },
		raw: true
	});

	let userId = bookingData && bookingData.userId, partnerId = bookingData && bookingData.partnerId, user;

	if (userId === requestUserId) user = partnerId;
	if (partnerId === requestUserId) user = userId;

	return await {
		userId,
		partnerId,
		user
	};
}

export async function getUserDetails(id) {
	return await User.findOne({
		attributes: ['id', 'email'],
		where: {
			id,
			deletedAt: null,
			isBan: false
		},
		raw: true
	});
}

export async function getUserLang(userId) {
	const profileData = await UserProfile.findOne({
		attributes: ['preferredLanguage'],
		where: {
			userId
		},
		raw: true
	});

	return await profileData && profileData.preferredLanguage || 'en';
}