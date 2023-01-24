import {
	GraphQLString as StringType,
	GraphQLFloat as FloatType,
	GraphQLInt as IntType
} from 'graphql';

import events from 'events';
var eventEmit = new events.EventEmitter();
import { payment } from '../../../config';

import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);

import { Reviews, User, UserProfile, Booking, BookingTips } from '../../models';
import GetReviewsType from '../../types/GetReviewsType';

import { convert } from '../../../helpers/currencyConvertion';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';
import { getCurrencyRates } from '../../../helpers/booking/commonHelpers';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const WriteReviews = {

	type: GetReviewsType,

	args: {
		userId: { type: StringType },
		bookingId: { type: IntType },
		authorId: { type: StringType },
		ratings: { type: FloatType },
		reviewContent: { type: StringType },
		currency: { type: StringType },
		amount: { type: FloatType },
		paymentType: { type: IntType },
	},

	async resolve({ request }, { userId, bookingId, authorId, ratings, reviewContent, currency, amount, paymentType }) {
		try {
			let customer, transactionId, updatedWalletBalance = 0, walletAmount = 0, tipsAmount = 0;
			let status = 200, errorMessage, stripePayment, tipsTotalFare = 0;

			if (request.user) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}
				const userData = await UserProfile.findOne({
					attributes: ['firstName', 'lastName', 'walletBalance', 'preferredCurrency', 'preferredLanguage', 'paymentCustomerId', 'paymentMethodId'],
					where: {
						userId: authorId,
					},
					raw: true
				});

				const bookingData = await Booking.findOne({
					attributes: ['userId', 'partnerId', 'discountAmount', 'userTotalFare', 'partnerTotalFare', 'specialBookingFare', 'userPayableFare'],
					where: {
						id: bookingId
					},
					raw: true
				});

				if (!bookingData) {
					return {
						status: 400,
						errorMessage: 'Oops! No record was found. Please try again!'
					};
				}

				const partnerProfileData = await UserProfile.findOne({
					attributes: ['userId', 'preferredLanguage', 'firstName', 'preferredCurrency'],
					where: {
						userId: bookingData.partnerId
					},
					raw: true
				});

				const userProfileData = await UserProfile.findOne({
					attributes: ['userId', 'preferredLanguage', 'firstName'],
					where: {
						userId: bookingData.userId
					},
					raw: true
				});

				if (amount && amount > 0) {
					if (paymentType === 3) {
						walletAmount = userData.walletBalance;
						if (walletAmount < amount) {
							return await {
								status: 400,
								errorMessage: 'Sorry! Insufficient balance in your wallet.'
							}
						}
					}

					let convertCurrency = partnerProfileData.preferredCurrency;
					tipsAmount = amount;

					if (paymentType === 2 && tipsAmount > 0) { // Card Payment - Stripe
						try {
							customer = userData && userData.paymentCustomerId;

							if (userData && userData.paymentMethodId) { // Fetch paymentMethodId from the UserProfile table
								let paymentMethod = await stripe.paymentMethods.retrieve(userData.paymentMethodId);

								if (paymentMethod) {
									stripePayment = await stripe.paymentIntents.create({
										amount: Math.round(tipsAmount * 100),
										currency,
										confirm: true,
										off_session: true,
										payment_method: paymentMethod.id,
										customer,
										use_stripe_sdk: true
									});

									if (stripePayment && stripePayment.status === 'requires_source_action'
										&& stripePayment.next_action && stripePayment.next_action.type === 'use_stripe_sdk') {
										status = 400;
										errorMessage = "Oops! your card requires authentication. Please update your saved card.";
									} else if (stripePayment && stripePayment.status === 'succeeded') {
										transactionId = stripePayment.id;
									} else {
										status = 400;
										errorMessage = 'Oops! something went wrong and unable to process the transaction';
									}
								} else {
									status = 400;
									errorMessage = 'Oops! something went wrong and unable to process the transaction with your saved card.';
								}
							} else {
								status = 400;
								errorMessage = "Oops! something went wrong. Please update your saved card. 1";
							}
						} catch (error) {
							status = 400;
							errorMessage = "Oops! something went wrong. Please update your saved card. 2";
						}
					} else if (paymentType === 3) { // Wallet
						updatedWalletBalance = parseFloat(walletAmount - tipsAmount);
						const balanceUpdate = await UserProfile.update({
							walletBalance: updatedWalletBalance
						}, {
							where: {
								userId: authorId
							}
						});
					} else {
						status = 400;
					}

					if (status === 200) {

						const createReviews = await Reviews.create({
							userId,
							bookingId,
							authorId,
							ratings,
							reviewContent
						});

						const createTip = await BookingTips.create({
							bookingId,
							userId: authorId,
							partnerId: bookingData.partnerId,
							amount: tipsAmount,
							userCurrency: currency,
							partnerCurrency: convertCurrency,
							paymentType,
							transactionId
						});

						if ((bookingData) && (bookingData.specialBookingFare > 0)) {
							tipsTotalFare = parseFloat(bookingData.specialBookingFare + tipsAmount);
						} else {
							tipsTotalFare = parseFloat(bookingData.userTotalFare + tipsAmount);
						}

						let userPayableFare = parseFloat(bookingData.userPayableFare + tipsAmount)

						let tipsPartnerTotalFare = parseFloat(bookingData.partnerTotalFare + tipsAmount);

						let updateBookingData = await Booking.update({
							isTipGiven: true,
							tipsAmount,
							tipsTotalFare,
							tipsPartnerTotalFare,
							userPayableFare
						}, {
							where: {
								id: bookingId
							}
						});

						let tipId = createTip.dataValues.id;

						if (convertCurrency != currency) {
							const { baseCurrency, rates } = await getCurrencyRates();
							tipsAmount = convert(baseCurrency.currencyCode, rates, amount, currency, convertCurrency);
						}

						eventEmit.emit('reviewAverage', { userId, bookingId, tipsAmount }, function (data) { });

						let pushNotificationContent = {
							userName: userProfileData['firstName'],
							partnerName: partnerProfileData['firstName'],
							bookingId,
							convertCurrency,
							amount: Number(tipsAmount),
							userAmount: Number(amount),
							currency
						};

						if (tipsAmount > 0) {
							sendNotifications({ type: 'serviceProviderTip', requestContent: pushNotificationContent, userId: bookingData.partnerId, lang: partnerProfileData.preferredLanguage, userType: 2 });
							sendNotifications({ type: 'userTip', requestContent: pushNotificationContent, userId: bookingData.userId, lang: userProfileData.preferredLanguage, userType: 1 });
						}

						return await {
							status,
							errorMessage,
							result: {
								id: tipId,
								userId: authorId,
								partnerId: bookingData.partnerId,
								bookingId,
								paymentType,
							}
						};
					} else {
						return await {
							status: 400,
							errorMessage
						}
					}
				} else {
					const createAReview = await Reviews.create({
						userId,
						bookingId,
						authorId,
						ratings,
						reviewContent
					});

					let pushNotificationContent = {
						bookingId,
						userName: userProfileData['firstName'],
						partnerName: partnerProfileData['firstName'],
					};

					eventEmit.emit('reviewAverage', { userId, bookingId }, function (data) { });

					if (ratings > 0) {
						if (request.user.id === bookingData.userId) {
							sendNotifications({ type: 'partnerRating', requestContent: pushNotificationContent, userId: bookingData.partnerId, lang: partnerProfileData.preferredLanguage, userType: 2 });
						} else {
							sendNotifications({ type: 'userRating', requestContent: pushNotificationContent, userId: bookingData.userId, lang: userProfileData.preferredLanguage, userType: 1 });
						}
					}

					return await {
						status: createAReview ? 200 : 400,
						errorMessage: createAReview ? null : 'Oops! something went wrong! Please try again.',

					};

				}
			} else {
				return {
					status: 500,
					errorMessage: 'Oops! It looks like you are not logged-in with your account. Please login with your account and try again.'
				}
			}
		} catch (error) {
			return {
				errorMessage: 'Oops! Something went wrong! ' + error,
				status: 400
			};
		}
	}
};

export default WriteReviews;

eventEmit.on('reviewAverage', async function (data, done) {

	let overallRating = 0;

	const reviewsData = await Reviews.findAll({
		attributes: ['userId', 'ratings'],
		where: {
			userId: data.userId
		},
		raw: true
	});

	const totalReviews = reviewsData.length;

	const ratingsArray = reviewsData.map(x => { return Number(x['ratings']) });

	if (totalReviews > 0) {
		overallRating = ratingsArray.reduce((total, currentValue) => { return total + currentValue });
		overallRating = overallRating / totalReviews;

		let userOverallRatingUpdate = await User.update({
			overallRating
		}, {
			where: {
				id: data.userId
			}
		})
	}

	done();
});
