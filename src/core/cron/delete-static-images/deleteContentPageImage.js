var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { contentPageUploadDir } from '../../../config';
import { TempImages, ContentPageDetails } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteContentPageImage = app => {

	new CronJob('0 0 */6 * * *', async function () {

		try {
			console.log('holy moly deleteContentPageImage requests...');

			const files = await readFileAsync(contentPageUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnContentPage = await ContentPageDetails.findOne({
						where: {
							pageBanner: file
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



					if (!existOnTemp && !existOnContentPage) {
						if (fs.existsSync(contentPageUploadDir + file)) {
							await deleteFileAsync(contentPageUploadDir + file);
						};

						if (fs.existsSync(contentPageUploadDir + 'small_' + file)) {
							await deleteFileAsync(contentPageUploadDir + 'small_' + file);
						};

						if (fs.existsSync(contentPageUploadDir + 'medium_' + file)) {
							await deleteFileAsync(contentPageUploadDir + 'medium_' + file);
						};

						if (fs.existsSync(contentPageUploadDir + 'large_' + file)) {
							await deleteFileAsync(contentPageUploadDir + 'large_' + file);
						};
					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteContentPageImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};


export default deleteContentPageImage;