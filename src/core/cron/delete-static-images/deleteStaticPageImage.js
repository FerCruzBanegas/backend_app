var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { staticpageUploadDir } from '../../../config';
import { TempImages, StaticPage, PrecautionNotification } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteStaticPageImage = app => {
	new CronJob('0 0 */6 * * *', async function () {
		try {

			console.log('holy moly deleteStaticPageImage requests...');

			const files = await readFileAsync(staticpageUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnStaticPage = await StaticPage.findOne({
						where: {
							pageBanner: file
						},
						raw: true
					});

					const existOnPrecaution = await PrecautionNotification.findOne({
						where: {
							imageName: file
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


					if (!existOnTemp && !existOnStaticPage && !existOnPrecaution) {
						if (fs.existsSync(staticpageUploadDir + file)) {
							await deleteFileAsync(staticpageUploadDir + file);
						}

						if (fs.existsSync(staticpageUploadDir + 'small_' + file)) {
							await deleteFileAsync(staticpageUploadDir + 'small_' + file);
						}

						if (fs.existsSync(staticpageUploadDir + 'medium_' + file)) {
							await deleteFileAsync(staticpageUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(staticpageUploadDir + 'large_' + file)) {
							await deleteFileAsync(staticpageUploadDir + 'large_' + file);
						}

					}
				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteStaticPageImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};


export default deleteStaticPageImage;