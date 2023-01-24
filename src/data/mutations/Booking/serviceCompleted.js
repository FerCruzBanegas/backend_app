
import {
	GraphQLFloat as FloatType,
	GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
	GraphQLString as StringType
} from 'graphql';
import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);
import {
	Booking, BookingHistory, User, UserProfile, BookingPromoCode, Orders
} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import { payment } from '../../../config';
import { getCustomerId } from '../../../libs/payment/stripe/helpers/getCustomerId';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { manualCurrencyConvertion } from '../../../helpers/currencyConvertion';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers';
import { calculatePriceDetails } from './helper/calculatePriceDetails';
import { sendSocketNotification } from '../../../helpers/socketNotification/sendSocketNotification';
import { getUserProfileData } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const serviceCompleted = {

	type: BookingRequestType,

	args: {
		bookingId: { type: new NonNull(IntType) },
		additionalDescription: { type: StringType },
		additionalFee: { type: FloatType },
		totalRideDistance: { type: FloatType },
	},

	async resolve({ request }, { bookingId, additionalDescription, additionalFee, totalRideDistance }) {
		let pushNotificationContent;
		let paymentType, paymentProcessed = false, transactionId = null;
		let customerId, errorMessage;
		let stripePayment, paymentStatus = 'pending', notes, walletBalance, walletUsed;
		let requestLang;
		let partnerConvertCurrency;

		try {

			if (!request.user) {
				return {
					status: 500,
					errorMessage: 'Oops! it looks like you are not logged-in with your account. Please login to continue.'
				}
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			// Booking Data
			const bookingData = await Booking.findOne({
				where: {
					id: bookingId
				},
				raw: true
			});

			const userId = bookingData.userId;
			const partnerId = bookingData.partnerId;


			let requestProfileParams = ['userId', 'preferredCurrency', 'preferredLanguage', 'firstName', 'picture', 'paymentCustomerId', 'walletBalance', 'walletUsed', 'paymentMethodId'];

			// User Data
			const userProfileData = await getUserProfileData(userId, requestProfileParams);

			walletBalance = userProfileData.walletBalance && userProfileData.walletBalance ? parseFloat(userProfileData.walletBalance) : 0;
			walletUsed = userProfileData && userProfileData.walletUsed ? parseFloat(userProfileData.walletUsed) : 0;

			// Partner Data

			const partnerProfileData = await getUserProfileData(partnerId, requestProfileParams);
			partnerConvertCurrency = partnerProfileData.preferredCurrency;

			const { rates } = await getCurrencyRates();

			if (bookingData && userProfileData) {
				if (bookingData.status === 'started') {

					let convertCurrency = userProfileData && userProfileData.preferredCurrency;
					paymentType = bookingData.paymentType;

					let bookingPromo = await BookingPromoCode.findOne({
						where: {
							bookingId
						},
						raw: true
					});

					const { priceStatus, priceErrorMessage, priceDetails } = await calculatePriceDetails(bookingData, partnerConvertCurrency, bookingPromo, additionalFee);

					if (priceStatus != 200) {
						return await {
							status: priceStatus,
							errorMessage: priceErrorMessage
						};
					}

					if (paymentType === 1) { // Cash
						paymentProcessed = true;
						paymentStatus = 'completed';
					} else if (paymentType === 2) { // Card - Stripe
						customerId = await getCustomerId(userId); // Stripe Customer ID

						if (userProfileData && userProfileData.paymentMethodId) { // Fetch paymentMethodId from the UserProfile table
							let paymentMethod = await stripe.paymentMethods.retrieve(userProfileData.paymentMethodId);

							if (paymentMethod) {
								try {
									stripePayment = await stripe.paymentIntents.create({
										amount: Math.round(priceDetails.userPayableFare * 100),
										currency: convertCurrency,
										confirm: true,
										off_session: true,
										payment_method: paymentMethod.id,
										customer: customerId,
										use_stripe_sdk: true,
										confirmation_method: 'manual'
									});

									if (stripePayment && stripePayment.status === 'requires_source_action'
										&& stripePayment.next_action && stripePayment.next_action.type === 'use_stripe_sdk') {
										paymentType = 1;
										paymentProcessed = true;
										notes = "The problem occurs with the saved card, it requires the authentication and payment type changed to Cash.";
									} else if (stripePayment && stripePayment.status === 'succeeded') {
										paymentProcessed = true; // Stripe Payment success
										transactionId = stripePayment.id;
									} else {
										paymentType = 1;
										paymentProcessed = true;
										errorMessage = 'Something went wrong with the saved card. We switched the payment type to Cash.';
									}
								} catch (error) {
									paymentType = 1;
									paymentProcessed = true;
									notes = "The problem occurs with the saved card, it requires the authentication and payment type changed to Cash." + error.message;
								}
							} else {
								paymentType = 1;
								paymentProcessed = true;
								notes = "Unable to find the payment method ID from the Stripe for the saved card and payment type changed to Cash.";
							}
						} else {
							paymentType = 1;
							paymentProcessed = true;
							notes = "No payment method ID for the user and payment type changed to Cash.";
						}
						paymentStatus = 'completed';
					} else { // Wallet

						if (userProfileData && userProfileData.walletBalance > 0 && priceDetails
							&& parseFloat(userProfileData.walletBalance) >= parseFloat(priceDetails.userPayableFare)) { // Having enough balance in wallet

							paymentType = 3;
							paymentStatus = 'completed';
							paymentProcessed = true;
							walletBalance = parseFloat(walletBalance) - parseFloat(priceDetails.userPayableFare);
							walletUsed = parseFloat(walletUsed) + parseFloat(priceDetails.userPayableFare);

						} else { // Not having enough balance in wallet

							paymentType = 1;
							paymentStatus = 'completed';
							notes = "Wallet doesn't have enough balance and payment type changed to Cash.";
							paymentProcessed = true;
						}

					}


					if (paymentProcessed) {
						const bookingUpdate = await Booking.update({
							totalRideDistance,
							status: 'completed',
							discountAmount: priceDetails.specialServiceFare,
							specialBookingFare: priceDetails.specialServiceTotalFare,
							totalFare: priceDetails.userTotalFare,
							userServiceFee: priceDetails.userServiceFee,
							partnerServiceFee: priceDetails.partnerServiceFee,
							currency: convertCurrency,
							userTotalFare: priceDetails.userTotalFare,
							partnerTotalFare: priceDetails.partnerTotalFare,
							paymentStatus,
							transactionId,
							notes,
							paymentType,
							travellingPrice: priceDetails.travellingPrice,
							completedAt: new Date(),
							additionalFee: priceDetails.additionalFee,
							userPayableFare: priceDetails.userPayableFare,
							additionalDescription
						}, {
							where: {
								id: bookingId
							}
						});

						if (paymentType === 3) { // If wallet payment processed successfully
							const updateUserWalletPrice = await UserProfile.update({
								walletBalance,
								walletUsed
							}, {
								where: {
									userId
								}
							});
						}

						const partnerStatusUpdate = await User.update({
							activeStatus: 'inactive'
						}, {
							where: {
								id: partnerId,
							}
						});

						const bookingHistoryUpdate = await BookingHistory.create({
							status: 'completed',
							bookingId,
							partnerId,
							userId
						});

						await Orders.update({
							status: 'cancelled'
						}, {
							where: {
								id: bookingData.orderId
							}
						});

						let content = {
							userId,
							partnerId,
							userDetails: {
								name: userProfileData.firstName,
								picture: userProfileData.picture,
								phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
								overallRating: userProfileData['user.overallRating'],
							},
							partnerDetails: {
								name: partnerProfileData.firstName,
								picture: partnerProfileData.picture,
								phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
								overallRating: partnerProfileData['user.overallRating'],
							},
							bookingId,
							bookingStatus: 'completed',
							paymentType,
							additionalFee: Number(priceDetails.additionalFee),
							currency: userProfileData.preferredCurrency,
							orderId: bookingData.orderId
						};


						sendSocketNotification('serviceCompleted-' + bookingId, content);

						// Push Notification to User
						requestLang = userProfileData && userProfileData['preferredLanguage'];
						// Push Notification to partner
						let partnerrequestLang = partnerProfileData && partnerProfileData['preferredLanguage'];

						sendNotifications({ type: 'serviceCompletedUser', requestContent: content, userId, lang: requestLang, userType: 1 });
						sendNotifications({ type: 'serviceCompletedPartner', requestContent: content, userId: partnerId, lang: partnerrequestLang, userType: 2 });
						if (priceDetails.additionalFee > 0) sendNotifications({ type: 'additionalWork', requestContent: content, userId, lang: requestLang, userType: 1 });

						let notificationAmount = manualCurrencyConvertion({
							amount: (paymentType === 1 ? Number(priceDetails.userTotalFare) : Number(priceDetails.partnerTotalFare)),
							fromPrice: rates[priceDetails.currency] || 0,
							toPrice: rates[partnerConvertCurrency] || 0
						});

						pushNotificationContent = {
							status: 'paymentSuccess',
							name: userProfileData['firstName'],
							bookingId,
							userId,
							picture: userProfileData['picture'],
							userServiceFee: Number(priceDetails.userServiceFee),
							partnerServiceFee: Number(priceDetails.partnerServiceFee),
							totalFare: Number(priceDetails.total),
							userTotalFare: Number(priceDetails.userTotalFare),
							partnerTotalFare: Number(priceDetails.partnerTotalFare),
							totalRideDistance,
							paymentType,
							currency: partnerConvertCurrency,
							userCurrency: convertCurrency,
							amount: notificationAmount,
							userDetails: {
								name: userProfileData.firstName,
								picture: userProfileData.picture,
								phoneNumber: userProfileData['user.phoneDialCode'] + '' + userProfileData['user.phoneNumber'],
								overallRating: userProfileData['user.overallRating'],
							},
							partnerDetails: {
								name: partnerProfileData.firstName,
								picture: partnerProfileData.picture,
								phoneNumber: partnerProfileData['user.phoneDialCode'] + '' + partnerProfileData['user.phoneNumber'],
								overallRating: partnerProfileData['user.overallRating'],
							},
							bookingId,
							bookingStatus: 'completed',
							userPayableFare: Number(priceDetails.userPayableFare)
						};

						sendNotifications({ type: 'paymentSuccess', requestContent: pushNotificationContent, userId: partnerId, lang: partnerrequestLang, userType: 2 });
						if (paymentType == 1) sendNotifications({ type: 'cashPayment', requestContent: pushNotificationContent, userId, lang: requestLang, userType: 1 });

						return await {
							status: 200,
							result: {
								userId,
								partnerId,
								specialServiceTotalFare: priceDetails.specialServiceTotalFare,
								totalFare: priceDetails.total,
								userServiceFee: priceDetails.userServiceFee,
								partnerServiceFee: priceDetails.partnerServiceFee,
								currency: convertCurrency,
								userTotalFare: priceDetails.userTotalFare,
								partnerTotalFare: priceDetails.partnerTotalFare,
								paymentStatus,
								transactionId,
								notes,
								paymentType,
								walletBalance,
								travellingPrice: priceDetails.travellingPrice,
								additionalFee: priceDetails.additionalFee,
								isSpecialTrip: priceDetails.isSpecialTrip,
								specialTripPrice: priceDetails.specialTripPrice,
								specialTripTotalFare: priceDetails.specialTripTotalFare
							}
						};

					} else {
						return await {
							status: 400,
							errorMessage: 'Oops, something went wrong!',
							result: {
								status: bookingData.status
							}
						};
					}

				} else {

					if (bookingData.status === 'completed') {
						errorMessage = 'Oops! it looks like you have already completed this trip. Please close your application and try again.';
					} else if (bookingData.status === 'cancelledByUser') {
						errorMessage = 'Oops! it looks like the user has already cancelled this trip. Please close your application and try again.';
					} else if (bookingData.status === 'cancelledByPartner') {
						errorMessage = 'Oops! it looks like you have already cancelled this trip. Please close your application and try again.';
					} else {
						errorMessage = 'Oops! something went wrong. Please try again.';
					}

					return await {
						status: 400,
						errorMessage,
						result: {
							status: bookingData.status
						}
					};

				}
			} else {
				return {
					errorMessage: 'Oops! something went wrong. Please try again.',
					status: 400
				};
			}
		} catch (error) {
			return {
				errorMessage: "Oops! Something went wrong! " + error,
				status: 400
			};
		}
	}
};

export default serviceCompleted;