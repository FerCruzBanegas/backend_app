import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import { profilePhotouploadDir } from '../../../config';

const profileImageUpload = app => {
    var upload = multer({
        storage: multer.diskStorage({
            destination: profilePhotouploadDir,
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

    app.post('/uploadProfileImage', upload.any('file'), async (req, res, next) => {

        let files = req.files;
        let status = 200, errorMessage, fileName;
        console.log(files)

        try {
            fileName = files[0].filename;
            status = 200;

            await sharp(files[0].path)
                .resize(100, 100)
                .toFile(profilePhotouploadDir + 'small_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            await sharp(files[0].path)
                .resize(200, 200)
                .toFile(profilePhotouploadDir + 'medium_' + fileName)
                .then(img => console.log(img))
                .catch(err => console.log(err))

            res.send({ status, errorMessage, fileName })
        } catch (error) {
            status = 400;
            errorMessage = 'Somthing went wrong' + error;
            console.log("errorsss", error)
            res.send({ status, errorMessage })
        }
    }
    )
}

export default profileImageUpload;