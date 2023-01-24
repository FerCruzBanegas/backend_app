import { sitename } from '../../../config';
import { sendMessage } from '../smsMethod';

const TwilioSms = app => {
    app.post('/send-verification-code', async function (req, res) {
        let responseStatus = 200, errorMessage;
        let phoneNumber = req.body.phoneNumber;
        let dialCode = req.body.dialCode;
        let userId = req.body.userId;
        let userType = req.body.userType;

        let verificationCode = Math.floor(1000 + Math.random() * 9000);
        let message = sitename + ' security code: ' + verificationCode;
        message += '. Use this to finish verification.';

        let convertedNumber = dialCode + phoneNumber;

        try {
            const { smsStatus, smsError } = await sendMessage({ message, to: convertedNumber, dialCode, phoneNumber, userId, userType });
            responseStatus = smsStatus;
            errorMessage = smsError;
        } catch (error) {
            responseStatus = 400;
            errorMessage = error.message;
        }

        res.send({ status: responseStatus, errorMessage, verificationCode });
    });
};

export default TwilioSms;
