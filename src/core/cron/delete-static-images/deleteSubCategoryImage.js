var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { subCategoryUploadDir } from '../../../config';
import { TempImages, SubCategory, OrderSubCategory } from '../../../data/models';


const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteSubCategoryImage = app => {

	new CronJob('0 0 */6 * * *', async function () {
		try {

			console.log('holy moly deleteSubCategoryImage requests...');

			const files = await readFileAsync(subCategoryUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnCategory = await SubCategory.findOne({
						where: {
							image: file
						},
						raw: true
					});

					const existOnOrderCategory = await OrderSubCategory.findOne({
						where: {
							image: file
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



					if (!existOnTemp && !existOnCategory && !existOnOrderCategory) {
						if (fs.existsSync(subCategoryUploadDir + file)) {
							await deleteFileAsync(subCategoryUploadDir + file);
						}

						if (fs.existsSync(subCategoryUploadDir + 'small_' + file)) {
							await deleteFileAsync(subCategoryUploadDir + 'small_' + file);
						}

						if (fs.existsSync(subCategoryUploadDir + 'medium_' + file)) {
							await deleteFileAsync(subCategoryUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(subCategoryUploadDir + 'large_' + file)) {
							await deleteFileAsync(subCategoryUploadDir + 'large_' + file);
						}

					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteSubCategoryImage cron error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};

export default deleteSubCategoryImage;