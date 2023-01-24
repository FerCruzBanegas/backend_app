var CronJob = require('cron').CronJob;
import sendEmailBooking from './sendEmailBooking';

const completeEmailCron = app => {
    new CronJob('0 */30 * * * *', async function() { // Every 5 Minutes
        console.log(`/${'*'.repeat(25)}/`);
		console.log(`/* COMPLETE EMAIL CRON STARTED at ${new Date().toString()} */`);
        try {
            await sendEmailBooking();
            console.log(`/* COMPLETE EMAIL CRON COMPLETED at ${new Date().toString()}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        } catch (error) {
            console.log(`/* COMPLETE EMAIL CRON ERROR: ${error}*/`);
            console.log(`/${'*'.repeat(25)}/`);
        }
    }, null, true, 'America/Los_Angeles')
}

export default completeEmailCron;