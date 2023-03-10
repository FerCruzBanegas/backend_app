var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { categoryUploadDir } from '../../../config';
import { TempImages, Category } from '../../../data/models';


const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteCategoryImage = app => {

	new CronJob('0 0 */6 * * *', async function () {
		try {

			console.log('holy moly deleteCategoryImage requests...');

			const files = await readFileAsync(categoryUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnCategory = await Category.findOne({
						where: {
							$or: [
								{ logoImage: file },
								{ bannerImage: file }
							]
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
						if (fs.existsSync(categoryUploadDir + file)) {
							await deleteFileAsync(categoryUploadDir + file);
						}

						if (fs.existsSync(categoryUploadDir + 'small_' + file)) {
							await deleteFileAsync(categoryUploadDir + 'small_' + file);
						}

						if (fs.existsSync(categoryUploadDir + 'medium_' + file)) {
							await deleteFileAsync(categoryUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(categoryUploadDir + 'large_' + file)) {
							await deleteFileAsync(categoryUploadDir + 'large_' + file);
						}

					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteCategoryImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};

export default deleteCategoryImage;