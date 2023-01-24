import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import { promoCodeUploadDir } from '../../../config';

const promoCodeImageUpload = app => {

    var upload = multer({
        storage: multer.diskStorage({
            destination: promoCodeUploadDir,
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

    app.post('/uploadPromoCodeImage', upload.any('file'), async (req, res, next) => {
        try {
            let files = req.files, fileName = files[0].filename;

            await sharp(files[0].path)
                .resize(60, null)
                .toFile(promoCodeUploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(95, null)
                .toFile(promoCodeUploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            res.send({ status: 200, fileName })
        }
        catch (error) {
            res.send({ status: 400, errorMessage: 'Somthing went wrong. ' + error })
        }
    })

}

export default promoCodeImageUpload;