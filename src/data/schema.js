import {
	GraphQLSchema as Schema,
	GraphQLObjectType as ObjectType,
} from 'graphql';

// Users
import validateEmailExist from './queries/Users/validateEmailExist';
import createUser from './mutations/Users/createUser';
import userLogout from './mutations/Users/userLogout';
import userAccount from './queries/Users/userAccount';
import userUpdate from './mutations/Users/userUpdate';
import removeDocument from './mutations/Users/removeDocument';
import updateDocumentUpload from './mutations/Users/updateDocumentUpload';
import userCategory from './mutations/Users/userCategory';
import deleteUser from './mutations/Users/deleteUser';

// Sms Verification
import sendVerificationSms from './mutations/SmsVerification/sendVerificationSms';
import verifyPhoneNumber from './mutations/SmsVerification/verifyPhoneNumber';

import getCategories from './queries/Category/getCategories';
import getSubCategories from './queries/Category/getSubCategories';

// Driver status
import updatePartnerstatus from './mutations/Users/updatePartnerstatus';
import updatePartnerLocation from './mutations/Users/updatePartnerLocation';

// User update information
import updatePaymentMethod from './mutations/Users/updatePaymentMethod';

// Add card details
import addCardDetails from './mutations/Payment/addCardDetails';
import removeCardDetails from './mutations/Payment/removeCardDetails';
import confirmSetupIntent from './mutations/Payment/confirmSetupIntent';
import confirmPaymentIntent from './mutations/Payment/confirmPaymentIntent';

// Payment details
import tripCalculation from './mutations/PaymentCalculation/tripCalculation';

// Country
import getAllCountries from './queries/Countries/getAllCountries';
import getAllCurrencies from './queries/Currencies/getAllCurrencies';

// Currency
import currency from './queries/Currencies/Currency';

// Driver payouts
import setDefaultPayout from './mutations/Payout/setDefaultPayout';
import addPayout from './mutations/Payout/addPayout';
import getPayouts from './queries/Payout/getPayouts';
import verifyPayout from './mutations/Payout/verifyPayout';
import confirmPayout from './mutations/Payout/confirmPayout';

// Reviews
import WriteReviews from './mutations/Reviews/WriteReviews';

// History
import getAllBookings from './queries/BookingHistory/getAllBookings';
import getBookingById from './queries/BookingHistory/getBookingById';

// Booking
import getNearestDrivers from './queries/Booking/getNearByDrivers';
import createBooking from './mutations/Booking/createBooking';
import declineBooking from './mutations/Booking/declineBooking';
import acceptBooking from './mutations/Booking/acceptBooking';
import cancelBooking from './mutations/Booking/cancelBooking';
import serviceCompleted from './mutations/Booking/serviceCompleted';
import autoCancel from './mutations/Booking/autoCancel';
import arrivedBooking from './mutations/Booking/arrivedBooking';
import reviewBooking from './mutations/Booking/reviewBooking';
import removeReviewImage from './mutations/Booking/removeReviewImage';
import startBooking from './mutations/Booking/startBooking';
import getWorkLogHistory from './queries/Booking/getWorkLogHistory';
import subServiceWork from './mutations/Booking/subServiceWork';

// Earnings
import getTotalEarning from './queries/Earnings/getTotalEarning';

// Saved Locations
import addSavedLocations from './mutations/SavedLocations/addSavedLocations';
import getAllSavedLocations from './queries/SavedLocations/getAllSavedLocations';
import removeSavedLocations from './mutations/SavedLocations/removeSavedLocations';

// Wallet
import addWallet from './mutations/Wallet/addWallet';

// Emergency Contact
import addEmergencyContact from './mutations/EmergencyContact/addEmergencyContact';
import shareLiveLocations from './mutations/EmergencyContact/shareLiveLocations';
import deleteEmergencyContact from './mutations/EmergencyContact/deleteEmergencyContact';

// Promocode
import getPromoCode from './queries/PromoCode/getPromoCode';
import validatePromoCode from './mutations/PromoCode/validatePromoCode';

//cancel reason
import getCancelReasons from './queries/CancelReason/getCancelReasons';

// Mobile app version
import getApplicationVersionInfo from './queries/SiteSettings/getApplicationVersionInfo';

// Static page
import getStaticPageContent from './queries/StaticPage/getStaticPageContent';
import getLegalInformation from './queries/StaticPage/getLegalInformation';

//PrecautionNotification
import getPrecautionNotification from './queries/PrecautionNotification/getPrecautionNotification';

//Chat
import createThread from "./mutations/Threads/createThread";
import readThread from "./mutations/Threads/readThread";
import getAllThreadItems from "./queries/Thread/getAllThreadItems";
import getUnreadThreadCount from "./queries/Thread/getUnreadThreadCount";

// Testing number
import addTestingNumber from './mutations/TestingNumber/addTestingNumber';
import deleteTestingNumber from './mutations/TestingNumber/deleteTestingNumber';
import getAllTestingNumbers from './queries/TestingNumber/getAllTestingNumbers';

// StripeKey
import getPaymentSettings from './queries/StripeKey/getPaymentSettings';

import getPaymentMethods from './queries/Payout/getPaymentMethods';
import updateProfileSettings from './mutations/Users/updateProfileSettings';
import testToken from './mutations/Users/testToken';

import updateJobLocation from './mutations/Users/updateJobLocation';
import addOrder from './mutations/Orders/addOrder';
import clearOrderedItems from './mutations/Orders/clearOrderedItems';
import removeOrderItem from './mutations/Orders/removeOrderItem';
import getOrder from './queries/Orders/getOrder';
import addOrderWhole from './mutations/Orders/addOrderWhole';

import updateUserProfile from './mutations/Users/updateUserProfile';
import getEmergencyContact from './queries/Users/getEmergencyContact';

import createScheduleBooking from './mutations/Booking/createScheduleBooking';
import cancelScheduleBooking from './mutations/Booking/cancelScheduleBooking';
import updateScheduleBooking from './mutations/Booking/updateScheduleBooking';

const schema = new Schema({
	query: new ObjectType({
		name: 'Query',
		fields: {
			validateEmailExist,
			userAccount,
			getCategories,
			getAllCountries,
			getAllCurrencies,
			getPayouts,
			currency,
			getNearestDrivers,
			getAllBookings,
			getBookingById,
			getTotalEarning,
			getAllSavedLocations,
			getPromoCode,
			getCancelReasons,
			getApplicationVersionInfo,
			getPrecautionNotification,
			getStaticPageContent,
			getAllThreadItems,
			getUnreadThreadCount,
			getAllTestingNumbers,
			getPaymentSettings,
			getPaymentMethods,
			getSubCategories,
			getLegalInformation,
			getOrder,
			getEmergencyContact,
			getWorkLogHistory
		},
	}),
	mutation: new ObjectType({
		name: 'Mutation',
		fields: {
			createUser,
			userLogout,
			userUpdate,
			sendVerificationSms,
			verifyPhoneNumber,
			updatePartnerstatus,
			updatePartnerLocation,
			updatePaymentMethod,
			addCardDetails,
			removeCardDetails,
			tripCalculation,
			setDefaultPayout,
			addPayout,
			WriteReviews,
			acceptBooking,
			cancelBooking,
			serviceCompleted,
			autoCancel,
			addSavedLocations,
			removeSavedLocations,
			addWallet,
			addEmergencyContact,
			shareLiveLocations,
			deleteEmergencyContact,
			validatePromoCode,
			confirmSetupIntent,
			confirmPaymentIntent,
			verifyPayout,
			confirmPayout,
			createThread,
			readThread,
			addTestingNumber,
			deleteTestingNumber,
			updateProfileSettings,
			testToken,
			updateJobLocation,
			addOrder,
			clearOrderedItems,
			removeOrderItem,
			updateUserProfile,
			createBooking,
			arrivedBooking,
			declineBooking,
			reviewBooking,
			addOrderWhole,
			removeReviewImage,
			removeDocument,
			updateDocumentUpload,
			userCategory,
			startBooking,
			subServiceWork,
			createScheduleBooking,
			cancelScheduleBooking,
			updateScheduleBooking,
			deleteUser
		}

	})
});

export default schema;