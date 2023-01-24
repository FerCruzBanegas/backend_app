import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import { documentUploadDir } from '../../../config';

const identityUpload = app => {
    var upload = multer({
        storage: multer.diskStorage({
            destination: documentUploadDir,
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

    app.post('/uploadIdentityImage', upload.any('file'), async (req, res, next) => {

        let files = req.files;
        let status = 200, errorMessage;
        let fileName = files[0].filename;

        try {
            status = 200;

            await sharp(files[0].path)
                .resize(200, null)
                .toFile(documentUploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(400, null)
                .toFile(documentUploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))


            res.send({ status, errorMessage, fileName });
						
        } catch (error) {
            status = 400;
            errorMessage = 'Somthing went wrong' + error;
            res.send({ status, errorMessage })
        }
    }
    )
}

export default identityUpload;