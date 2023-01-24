import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import { verifyJWTToken } from '../auth';
import { reviewImageUploadDir } from '../../config';
// Models
import {
	User,
	BookingReviewImage
} from '../../data/models';

const reviewImageUpload = app => {

	var upload = multer({
		storage: multer.diskStorage({
			destination: reviewImageUploadDir,
			filename: (req, file, cb) => crypto.pseudoRandomBytes(16, (err, raw) => {
				let ext = '';
				if (err) return cb(err);

				switch (file.mimetype) {
					case 'image/jpeg':
						ext = '.jpeg';
						break;
					case 'image/png':
						ext = '.png';
						break;
					case 'image/jpg':
						ext = '.jpg';
						break;
					case 'image/svg+xml':
						ext = '.svg';
						break;
				}
				cb(null, raw.toString('hex') + ext);
			})
		})
	});

	app.post('/uploadReviewImage', upload.any('file'), async (req, res, next) => {

		let files = req.files;
		let orderId = Number(req.body.orderId);
		let requestHeader = req.headers;
		let isLoggedInUser;
		let status = 200, errorMessage;

		try {
			let fileName = files[0].filename;

			await sharp(files[0].path)
				.resize(200, null)
				.toFile(reviewImageUploadDir + 'small_' + fileName)
				.then(img => console.log(img))
				.catch(err => console.log(err))

			await sharp(files[0].path)
				.resize(400, null)
				.toFile(reviewImageUploadDir + 'medium_' + fileName)
				.then(img => console.log(img))
				.catch(err => console.log(err))


			if (requestHeader && requestHeader.auth) {
				isLoggedInUser = await verifyJWTToken(requestHeader.auth);
			}

			if (requestHeader &&
				((requestHeader.isAuth === true && isLoggedInUser) || !requestHeader.isAuth)) {

				const userLogin = await User.findOne({
					attributes: ['email', 'id'],
					where: {
						email: isLoggedInUser.email,
						deletedAt: null
					}
				});

				if (userLogin) {

					status = 200;

					const addReviewImages = await BookingReviewImage.create({
						orderId,
						imageName: fileName,
					});

					res.send({ status, errorMessage, files });

				} else {
					status = 400;
					errorMessage = 'Sorry user not exist in database!';
					res.send({ status, errorMessage });
				}
			} else {
				status = 400;
				errorMessage = 'Please provide auth token';
			}
		} catch (error) {
			status = 400;
			errorMessage = "Oops! Something went wrong! " + error;
			res.send({ status, errorMessage });
		}
	});



};

export default reviewImageUpload;
