var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { reviewImageUploadDir } from '../../../config';
import { TempImages, BookingReviewImage } from '../../../data/models';


const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteReviewImage = app => {

	new CronJob('0 0 */6 * * *', async function () {
		try {

			console.log('holy moly deleteReviewImage requests...');

			const files = await readFileAsync(reviewImageUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnCategory = await BookingReviewImage.findOne({
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
						if (fs.existsSync(reviewImageUploadDir + file)) {
							await deleteFileAsync(reviewImageUploadDir + file);
						}

						if (fs.existsSync(reviewImageUploadDir + 'small_' + file)) {
							await deleteFileAsync(reviewImageUploadDir + 'small_' + file);
						}

						if (fs.existsSync(reviewImageUploadDir + 'medium_' + file)) {
							await deleteFileAsync(reviewImageUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(reviewImageUploadDir + 'large_' + file)) {
							await deleteFileAsync(reviewImageUploadDir + 'large_' + file);
						}

					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteReviewImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};

export default deleteReviewImage;