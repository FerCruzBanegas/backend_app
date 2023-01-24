import sequelize from '../sequelize';

// Models
import AdminUser from './siteadmin/AdminUser';
import User from './User';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';
import Category from './Category';
import SMSVerification from './SMSVerification';
import Pricing from './Pricing';

// Table related to Currencies
import Currencies from './Currencies';
import CurrencyRates from './CurrencyRates';

import Country from './Country';

import PaymentMethods from './PaymentMethods';
import Payout from './Payout';
import BookingHistory from './BookingHistory';
import WorkHistory from './WorkHistory';
import WorkLogHistory from './WorkLogHistory';

import Booking from './Booking';
import BookingTips from './BookingTips';

import SavedLocations from './SavedLocations';

//Reviews
import Reviews from './Reviews';

// Wallet
import WalletHistory from './WalletHistory';

// Emergency Contact
import EmergencyContact from './EmergencyContact';

// Promo code
import PromoCode from './PromoCode';
import BookingPromoCode from './BookingPromoCode';

//Site settings
import SiteSettings from './SiteSettings'

//Home Page
import HomePage from './HomePage'

//Booking Cancel reasons
import BookingCancelReason from './BookingCancelReason'

//Admin Cancel Reason
import CancelReason from './CancelReason'

//Admin Manage Location
import Location from './Location'

import TransactionHistory from './TransactionHistory';
import FailedTransactionHistory from './FailedTransactionHistory';

import StaticPage from './StaticPage';

import ContentPageDetails from './ContentPageDetails';
import TempImages from './TempImages';
// Admin Roles and Privileges
import AdminRoles from './siteadmin/AdminRoles';
import AdminPrivileges from './siteadmin/AdminPrivileges';
import Privileges from './siteadmin/Privileges';
import PrivilegesLink from './siteadmin/PrivilegesLink';

//Precaution Notification
import PrecautionNotification from './PrecautionNotification';

import Threads from './Threads';
import ThreadItems from './ThreadItems';

import BookingReviewImage from './BookingReviewImage';
import SubCategory from './SubCategory';
import UserCategory from './UserCategory';
import UserDocument from './UserDocument';

import TestingNumber from './TestingNumber';

import Orders from './Orders';
import OrderItems from './OrderItems';
import OrderCategory from './OrderCategory';
import OrderSubCategory from './OrderSubCategory';

import SmsMethods from './SmsMethods';

//Schedule Bookings
import ScheduleBooking from './ScheduleBooking';
import ScheduleBookingHistory from './ScheduleBookingHistory';

function sync(...args) {
  return sequelize.sync(...args);
}

// User Table - Releation with other Tables
User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

// Other tables relations with User
UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

UserLogin.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

User.hasMany(Payout, {
  foreignKey: 'userId',
  as: 'payout',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Payout.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

AdminRoles.hasMany(AdminPrivileges, {
  foreignKey: 'roleId',
  as: 'adminPrivileges',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

AdminPrivileges.belongsTo(AdminRoles, {
  foreignKey: 'roleId',
  as: 'adminRoles',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

Threads.hasMany(ThreadItems, {
  foreignKey: 'threadId',
  as: 'threadItems',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

ThreadItems.belongsTo(Threads, {
  foreignKey: 'threadId',
  as: 'threads',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

OrderItems.belongsTo(Orders, {
  foreignKey: 'orderId',
  as: 'orders',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Orders.hasMany(OrderItems, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});


UserCategory.belongsTo(Category, {
  foreignKey: 'orderId',
  as: 'category',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Category.hasMany(UserCategory, {
  foreignKey: 'mainCategoryId',
  as: 'userCategory',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

export default { sync };
export {
  AdminUser,
  User,
  UserProfile,
  Category,
  SMSVerification,
  UserLogin,
  Currencies,
  CurrencyRates,
  Country,
  PaymentMethods,
  Payout,
  BookingHistory,
  Booking,
  Reviews,
  SavedLocations,
  WalletHistory,
  EmergencyContact,
  PromoCode,
  BookingPromoCode,
  SiteSettings,
  BookingCancelReason,
  HomePage,
  CancelReason,
  Location,
  TransactionHistory,
  FailedTransactionHistory,
  StaticPage,
  Pricing,
  BookingTips,
  ContentPageDetails,
  TempImages,
  AdminRoles,
  AdminPrivileges,
  PrecautionNotification,
  Threads,
  ThreadItems,
  BookingReviewImage,
  SubCategory,
  UserCategory,
  UserDocument,
  Privileges,
  PrivilegesLink,
  TestingNumber,
  Orders,
  OrderItems,
  WorkHistory,
  WorkLogHistory,
  OrderCategory,
  OrderSubCategory,
  SmsMethods,
  ScheduleBooking,
  ScheduleBookingHistory,
};
