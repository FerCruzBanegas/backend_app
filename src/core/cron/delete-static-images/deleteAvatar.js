var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { profilePhotouploadDir } from '../../../config';
import { TempImages, UserProfile } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteAvatar = app => {

	new CronJob('0 0 */6 * * *', async function () {

		try {

			console.log('holy moly deleteAvatar requests...');

			const files = await readFileAsync(profilePhotouploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnSiteSettings = await UserProfile.findOne({
						where: {
							picture: file
						},
						raw: true
					});

					const existOnTemp = await TempImages.findOne({
						where: {
							fileName: file,
							createdAt: {
								$lt: new Date(new Date() - 1 * 60 * 60 * 1000)
							}

						},
						raw: true
					});

					if (!existOnTemp && !existOnSiteSettings) {
						if (fs.existsSync(profilePhotouploadDir + file)) {
							await deleteFileAsync(profilePhotouploadDir + file);
						}

						if (fs.existsSync(profilePhotouploadDir + 'small_' + file)) {
							await deleteFileAsync(profilePhotouploadDir + 'small_' + file);
						}

						if (fs.existsSync(profilePhotouploadDir + 'medium_' + file)) {
							await deleteFileAsync(profilePhotouploadDir + 'medium_' + file);
						}

						if (fs.existsSync(profilePhotouploadDir + 'large_' + file)) {
							await deleteFileAsync(profilePhotouploadDir + 'large_' + file);
						}
					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteAvatar error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};


export default deleteAvatar;