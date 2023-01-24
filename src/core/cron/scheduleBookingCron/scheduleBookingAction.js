import moment from 'moment';
import { RateLimit } from 'async-sema';
const AllowedLimit = RateLimit(100); // 100 execution per second
import { Booking, ScheduleBooking, SiteSettings, OrderItems, SubCategory, OrderSubCategory, BookingReviewImage } from "../../../data/models";
// Helpers
import {
	createBookingHistory,
	getNearestDrivers
} from '../../../helpers/booking/bookingHelpers';
import {
	updatePartnerActiveStatus,
	getUserProfileData
} from '../../../helpers/booking/commonHelpers';
import {
	updateBookingDetails,
	updateScheduleBookingStatus,
	createScheduleBookingHistory
} from '../../../helpers/booking/scheduleBookingHelpers';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { convert } from '../../../helpers/currencyConvertion';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers';

const scheduleBookingAction = async () => {
	let i, assignedPartnerData = [];
	let scheduleTriggerDuration = 15; // 15 Minutes - Find future booking upto 15 minutes
	let currentTimeStamp = moment().unix();
	let expectedScheduleTriggerAt = moment.unix(currentTimeStamp).add(scheduleTriggerDuration, 'minutes').format('YYYY-MM-DD HH:mm:ss');
	expectedScheduleTriggerAt = moment(expectedScheduleTriggerAt).format('YYYY-MM-DD HH:mm');

	const scheduleBookingList = await ScheduleBooking.findAll({ // Finding the scheduled bookings
		attributes: ['id', 'bookingId', 'scheduleFrom', 'scheduleTo'],
		where: {
			status: 'scheduled',
			scheduleFrom: {
				$lte: expectedScheduleTriggerAt
			}
		},
		order: [['scheduleFrom', 'ASC']],
		raw: true
	});

	if (scheduleBookingList && scheduleBookingList.length > 0) {

		for (i in scheduleBookingList) {
			await AllowedLimit();
			let scheduleBookingData = scheduleBookingList[i];
			let scheduleId = scheduleBookingData && scheduleBookingData.id;
			let bookingId = scheduleBookingData && scheduleBookingData.bookingId;
			let partnerId = null, assignedPartnerQuery = ''; // For provider
			let userPreferredLang, partnerPreferredLang;
			let pushNotificationContent = {}, userId;
			let formattedScheduleFrom, formattedScheduleTo;

			if (scheduleBookingData && scheduleBookingData.scheduleFrom) {
				formattedScheduleFrom = moment(scheduleBookingData.scheduleFrom).utc().set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
				formattedScheduleTo = moment(scheduleBookingData.scheduleTo).utc().set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
			}

			assignedPartnerData = [...new Set(assignedPartnerData)]; // Prepare the assignedPartnerData look up
			assignedPartnerData && assignedPartnerData.length > 0 && assignedPartnerData.map((o, i) => {
				// Prepare the already assignedPartnerData where IN query
				assignedPartnerQuery = assignedPartnerQuery + (i !== 0 ? `, "${o}"` : `"${o}"`);
			});

			const bookingData = await Booking.findOne({
				where: {
					id: bookingId
				},
				raw: true
			});

			pushNotificationContent = {
				bookingId
			};

			userId = bookingData.userId;

			let orderItemDetails = await OrderItems.findAll({
				attributes: ['subCategoryId'],
				where: {
					orderId: bookingData.orderId,
				},
				raw: true
			});

			let subCategoryId = orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map((item) => { return item.subCategoryId });

			const userProfileData = await getUserProfileData(userId, null); // Fetch user data
			userPreferredLang = userProfileData && userProfileData.preferredLanguage;

			const getSiteSettings = await SiteSettings.findAll({
				attributes: ['name', 'value'],
				where: {
					name: {
						$in: ['allowableDistace', 'allowedServices']
					}
				},
				raw: true
			});

			// Send push notification to user for schedule ride initiate
			sendNotifications({ type: 'scheduleInitiate', requestContent: pushNotificationContent, userId, lang: userPreferredLang, userType: 1 });

			let allowableDistance = getSiteSettings && getSiteSettings.find((o) => o.name === 'allowableDistace');

			// Find the nearest Partner
			const nearestPartner = await getNearestDrivers(bookingData.userLocationLat, bookingData.userLocationLng, userId, allowableDistance.value, subCategoryId, assignedPartnerQuery);

			if (nearestPartner && nearestPartner.length > 0) { // assignedPartnerData Available
				partnerId = nearestPartner[0].id;
				assignedPartnerData.push(partnerId);
				const partnerProfileData = await getUserProfileData(partnerId, null); // Fetch partner data
				partnerPreferredLang = partnerProfileData && partnerProfileData.preferredLanguage;
				await createBookingHistory(bookingId, userId, partnerId);
				await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'completed');
				await updateScheduleBookingStatus(bookingId, null, 'completed', 'created', null);
				await updatePartnerActiveStatus(partnerId, 'active');
				await updateBookingDetails(bookingId, partnerId);

				let reviewImage = await BookingReviewImage.findAll({
					where: {
						orderId: bookingData.orderId,
					},
					raw: true
				});

				let jobList = [];
				jobList = await Promise.all(orderItemDetails && orderItemDetails.length > 0 && orderItemDetails.map(async (item) => {
					let data = await SubCategory.findOne({
						where: {
							id: item.subCategoryId
						}
					});

					const orderSubCat = await OrderSubCategory.create({
						status: 'active',
						name: data.name,
						categoryId: data.categoryId,
						orderId: bookingData.orderId,
						subCategoryId: data.id,
						description: data.description,
						image: data.image
					});

					return {
						totalQuantity: item.totalQuantity,
						name: data.name
					}
				}));

				let subCategoryList = jobList.map(function (elem) {
					return (elem.name);
				}).join(", ");

				const { baseCurrency, rates } = await getCurrencyRates();


				let convertPartnerTotalFare = bookingData.partnerTotalFare;
				if (partnerProfileData && partnerProfileData.preferredCurrency !== bookingData.currency) {
					convertPartnerTotalFare = convert(baseCurrency.currencyCode, rates, convertPartnerTotalFare, bookingData.currency, partnerProfileData.preferredCurrency);
				}

				let content = {
					userId,
					partnerId,
					userDetails: {
						name: userProfileData.firstName,
						picture: userProfileData.picture,
						phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
						overallRating: userProfileData['user.overallRating'],
					},
					partnerDetails: {
						name: partnerProfileData.firstName,
						picture: partnerProfileData.picture,
						phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
						overallRating: partnerProfileData['user.overallRating'],
					},
					bookingId,
					bookingStatus: 'created',
					userLocation: userProfileData.preferredLocation,
					userLocationLat: userProfileData.preferredLat,
					userLocationLng: userProfileData.preferredLng,
					reviewDescription: bookingData.reviewDescription,
					reviewImage,
					estimatedTotalFare: convertPartnerTotalFare,
					jobList,
					status: 'serviceRequest',
					subCategoryList,
					updatedAt: moment().utc().unix()
				};

				sendSocketNotification('serviceRequest-' + partnerId, content);
				sendNotifications({ type: 'serviceRequest', requestContent: content, userId: partnerId, lang: partnerPreferredLang, userType: 2 });

			} else { // No Partners
				await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'failed');
				await updateScheduleBookingStatus(bookingId, bookingData.orderId); // ScheduleBooking => failed & Booking => expired
				let declineContent = {
					userId,
					userDetails: {
						name: userProfileData.firstName,
						picture: userProfileData.picture,
						phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
						overallRating: userProfileData['user.overallRating'],
					},
					bookingId,
					bookingStatus: 'declined'
				};
				sendNotifications({ type: 'serviceDeclined', requestContent: declineContent, userId, lang: userPreferredLang, userType: 1 });
				sendSocketNotification('serviceDeclined-' + bookingId, declineContent);
			}
		}
	}
}

export default scheduleBookingAction;