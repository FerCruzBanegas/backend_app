import { SmsMethods, SMSVerification } from '../../data/models';
import twilio from 'twilio';
import moment from 'moment';

const Vonage = require('@vonage/server-sdk');

export async function sendMessage({ message, to, dialCode, phoneNumber, userId, userType }) {
	try {

		let today = moment();

		const data = await SmsMethods.findOne({
			where: { status: true },
			raw: true
		});

		let from = data.phoneDialCode + data.phoneNumber;
		let status = 200, errorMessage = null;


		if (phoneNumber) {
			let findUpdatedTime = await SMSVerification.findOne({
				attributes: ['updatedAt'],
				where: {
					phoneNumber,
					phoneDialCode: dialCode,
					userId,
					userType
				},
				raw: true
			});

			if (findUpdatedTime && findUpdatedTime.updatedAt != null) {
				let otpUpdatedAt = moment(findUpdatedTime.updatedAt);
				let timeDiff = today.diff(otpUpdatedAt, 'minutes');
				if (timeDiff < 2) {
					status = 400;
					errorMessage = 'Please try again after 2 minutes to receive a new OTP.';
				}
			}
		}


		if (status === 200) {
			if (data.id == 2) {
				let text = message;
				const vonage = new Vonage({
					apiKey: data.accountId,
					apiSecret: data.securityId,
				});

				const response = await new Promise((resolve, reject) => {
					const nexmoData = vonage.message.sendSms(from, to, text, (err, responseData) => {
						if (err) {
							resolve({
								status: 400,
								errorMessage: err
							})
						} else {
							if (responseData && responseData.messages && responseData.messages[0]['status'] === "0") {
								status = 200;
							} else {
								status = 400;
								errorMessage = responseData && responseData.messages && responseData.messages[0]['error-text'];
							}
							resolve({
								status,
								errorMessage
							})
						}
					});
				});

				if (response) {
					status = response.status;
					errorMessage = response.errorMessage;
				}

			} else {
				const client = new twilio(data.accountId, data.securityId);
				const twilioData = await client.messages
					.create({
						body: message,
						from,
						to
					}).then(() => {
						status = 200;
					})
					.catch(err => {
						status = 400,
							errorMessage = err.message
					});
			}
		}

		return await {
			smsStatus: status,
			smsError: errorMessage
		}

	}
	catch (error) {
		return {
			smsStaus: 400,
			smsError: error
		};
	}
}