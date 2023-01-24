var CronJob = require('cron').CronJob;
import fs from 'fs';
import { promisify } from 'util';

import { documentUploadDir } from '../../../config';
import { TempImages, UserDocument } from '../../../data/models';

const readFileAsync = promisify(fs.readdir);
const deleteFileAsync = promisify(fs.unlink);

const deleteUserIdentity = app => {

	new CronJob('0 0 */6 * * *', async function () {
		try {

			console.log('holy moly deleteUserIdentity requests...');

			const files = await readFileAsync(documentUploadDir);

			const promise = files && files.length > 0 && files.map(async (file) => {

				if (!file.includes('small') && !file.includes('medium') && !file.includes('large')) {
					const existOnSiteSettings = await UserDocument.findOne({
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

					if (!existOnTemp && !existOnSiteSettings) {
						if (fs.existsSync(documentUploadDir + file)) {
							await deleteFileAsync(documentUploadDir + file);
						}

						if (fs.existsSync(documentUploadDir + 'small_' + file)) {
							await deleteFileAsync(documentUploadDir + 'small_' + file);
						}

						if (fs.existsSync(documentUploadDir + 'medium_' + file)) {
							await deleteFileAsync(documentUploadDir + 'medium_' + file);
						}

						if (fs.existsSync(documentUploadDir + 'large_' + file)) {
							await deleteFileAsync(documentUploadDir + 'large_' + file);
						}

					}

				} else {
					console.log('Not required');
				}

			});

			const resolve = await Promise.all(promise);

		} catch (err) {
			console.log('remove deleteUserIdentity error: ', err);
		};
	}, null, true, 'America/Los_Angeles');
};


export default deleteUserIdentity;