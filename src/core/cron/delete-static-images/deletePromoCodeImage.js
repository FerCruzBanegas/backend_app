var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { promoCodeUploadDir } from '../../../config';
import { TempImages, PromoCode } from '../../../data/models';


const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deletePromoCodeImage = app => {

	new CronJob('0 0 */6 * * *', async function () {

		try {

			console.log('holy moly deletePromoCodeImage requests...');

			const files = await readFileAsync(promoCodeUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnCategory = await PromoCode.findOne({
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



					if (!existOnTemp && !existOnCategory) {
						if (fs.existsSync(promoCodeUploadDir + file)) {
							await deleteFileAsync(promoCodeUploadDir + file);
						}

						if (fs.existsSync(promoCodeUploadDir + 'small_' + file)) {
							await deleteFileAsync(promoCodeUploadDir + 'small_' + file);
						}

						if (fs.existsSync(promoCodeUploadDir + 'medium_' + file)) {
							await deleteFileAsync(promoCodeUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(promoCodeUploadDir + 'large_' + file)) {
							await deleteFileAsync(promoCodeUploadDir + 'large_' + file);
						}
					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deletePromoCodeImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};

export default deletePromoCodeImage;