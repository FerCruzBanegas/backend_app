var CronJob = require('cron').CronJob;
import sequelize from '../../data/sequelize';
import { Booking, BookingHistory, User, SiteSettings } from '../../data/models';
import { sendSocketNotification } from '../../helpers/socketNotification/sendSocketNotification';

const tripAutoCancelCron = app => {
	// CronJob(seconds minutes hours day-of-month months day-of-week)
	new CronJob('0 */2 * * * *', async function () { // Every 2 minutes
		console.log('holy moly expired the not responding trip requests...');
		try {

			let bulkData = [];
			const getSiteSettings = await SiteSettings.findOne({
				attributes: ['name', 'value'],
				where: {
					name: 'notificationInterval'
				},
				raw: true
			});

			let interval = (Number(getSiteSettings.value) / 60) + 2;

			const bookingData = await Booking.findAll({
				attributes: ['id', 'status', 'userId', 'partnerId', 'createdAt', [sequelize.literal('TIMESTAMPDIFF(MINUTE, createdAt, NOW())'), 'minute_difference']],
				having: {
					'minute_difference': {
						$gt: interval //  minutes not reponding trip request
					},
					status: 'created',
				},
				raw: true
			});

			if (bookingData && bookingData.length > 0) {
				let bookingIds = bookingData.map(x => { return x['id'] });
				let partnerIds = bookingData.map(x => { return x['partnerId'] });

				await Booking.update(
					{
						status: 'expired',
						notes: 'The trip did not accept/decline by the partner and the system updated to the expired status by background CRON.'
					},
					{ where: { id: { $in: bookingIds } } }
				);

				if (partnerIds && partnerIds.length > 0) {
					await User.update(
						{ activeStatus: 'inactive' },
						{
							where: {
								id: { $in: partnerIds },
								activeStatus: 'active'
							}
						}
					);
				}

				await BookingHistory.create({
					status: 'expired',
					bookingId,
					partnerId,
					userId
				});;

				bulkData = bookingData.map(item => {
					sendSocketNotification(`tripRequest-${item.userId}`, null, "Sorry, no partners available for your request. Please try again.");
					return {
						status: 'expired',
						bookingId: item.id,
						partnerId: item.partnerId,
						userId: item.userId
					}
				});

				const bulkCreate = await BookingHistory.bulkCreate(bulkData);

			}
		} catch (error) {
			console.log('TRIP AUTO CANCEL CRON ERROR: ', error);
		}

	}, null, true, 'America/Los_Angeles');

};

export default tripAutoCancelCron;