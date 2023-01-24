var CronJob = require('cron').CronJob;
import scheduleBookingAction from './scheduleBookingAction';

const scheduleBookingCron = app => {
    new CronJob('0 */5 * * * *', async function() { // Every 5 Minutes
        console.log(`/${'*'.repeat(25)}/`);
		console.log(`/* SCHEDULE BOOKING CRON STARTED at ${new Date().toString()} */`);
        try {
            await scheduleBookingAction();
            console.log(`/* SCHEDULE BOOKING CRON COMPLETED at ${new Date().toString()}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        } catch (error) {
            console.log(`/* SCHEDULE BOOKING CRON ERROR: ${error}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        }
    }, null, true, 'America/Los_Angeles')
}

export default scheduleBookingCron;