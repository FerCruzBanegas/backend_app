import multer from 'multer';
import crypto from 'crypto';
const fs = require('fs');

import { toneUploadDir } from '../../../config';


const uploadTone = app => {

	var upload = multer({
		storage: multer.diskStorage({
			destination: toneUploadDir,
			filename: function (req, file, cb) {
				crypto.pseudoRandomBytes(16, function (err, raw) {
					if (err) return cb(err);
					let ext;
					switch (file.mimetype) {
						case 'audio/mp3':
							ext = '.mp3';
							break;

						case 'audio/mpeg':
							ext = '.mp3';
							break;
					}
					cb(null, raw.toString('hex') + ext);
				})
			}
		})
	});

	async function removeFiles(fileName, filePath) {
		if (fs.existsSync(filePath + fileName)) {
			fs.unlink(filePath + fileName, (err) => {
				if (err) console.log(err)
			})
		}
	}

	app.post('/deleteTone', function (req, res, next) {
		next()
	}, async (req, res, next) => {
		const fileName = req.body.fileName;
		await removeFiles(fileName, toneUploadDir)
		res.send({ status: 200 })
	})

	app.post('/uploadTone', function (req, res, next) {
		next();
	}, upload.array('file'), async (req, res, next) => {
		let files = req.files;
		let type = req.body.type;
		let status = 200, errorMessage, fileName;
		try {
			fileName = files[0].filename;
			status = 200;
			res.send({ status, errorMessage, fileName })
		} catch (error) {
			status = 400;
			errorMessage = 'Somthing went wrong' + error;
			res.send({ status, errorMessage })
		}
	}
	)
}

export default uploadTone;
