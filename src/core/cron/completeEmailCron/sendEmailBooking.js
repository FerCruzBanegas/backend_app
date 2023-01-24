import { RateLimit } from 'async-sema';
const AllowedLimit = RateLimit(100); // 100 execution per second
import { Booking } from "../../../data/models";
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';
import { sendEmail } from '../../../libs/sendEmail';

const sendEmailBooking = async () => {

	let bookingIndex;
	const bookingList = await Booking.findAll({ // Finding the scheduled bookings
		attributes: ['id', 'orderId', 'completedAt', 'status', 'isMailSent', 'userId', 'partnerId'],
		where: {
			status: 'completed',
			isMailSent: false,
		},
		order: [['completedAt', 'ASC']],
		raw: true
	});

	if (bookingList && bookingList.length > 0) {

		for (bookingIndex in bookingList) {
			await AllowedLimit();
			let bookingData = bookingList[bookingIndex];

			const userId = bookingData.userId;
			const partnerId = bookingData.partnerId;
			const content = {
				orderId: bookingData.orderId
			};

			let requestProfileParams = ['userId', 'preferredCurrency', 'preferredLanguage', 'firstName', 'picture', 'paymentCustomerId', 'walletBalance', 'walletUsed', 'paymentMethodId'];

			// User Data
			const userProfileData = await getUserProfileData(userId, requestProfileParams);
			const partnerProfileData = await getUserProfileData(partnerId, requestProfileParams);
			userProfileData && sendEmail(userProfileData['user.email'], 'userReceipt', content);
			partnerProfileData && sendEmail(partnerProfileData['user.email'], 'providerReceipt', content);

			const updateBooking = await Booking.update(
				{
					isMailSent: true,
				},
				{ where: { id: bookingData.id } }
			);

		}
	}
}

export default sendEmailBooking;