import DataType from 'sequelize';
import Model from '../sequelize';

const Booking = Model.define('Booking', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.STRING,
        allowNull: false
    },

    partnerId: {
        type: DataType.STRING
    },

    orderId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    categoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    status: {
        type: DataType.ENUM('created', 'declined', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByUser', 'cancelledByPartner', 'completed', 'expired', 'scheduled'),
        allowNull: false
    },

    userLocation: {
        type: DataType.STRING
    },

    userLocationLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    userLocationLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    startLocation: {
        type: DataType.STRING,
        allowNull: false,
    },

    startLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    startLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    startedAt: {
        type: DataType.DATE
    },

    endLocation: {
        type: DataType.STRING,
        allowNull: false,
    },

    endLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    endLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    completedAt: {
        type: DataType.DATE
    },

    currency: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'USD'
    },

    pricingType: {
        type: DataType.ENUM('fixed', 'hourly'),
        allowNull: false,
    },

    travellingPrice: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    discountAmount: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    specialBookingFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    totalRideDistance: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    estimatedTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    totalFare: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    additionalFee: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    userServiceFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        allowNull: false,
        defaultValue: 'percentage'
    },

    userServiceFeeValue: {
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    partnerServiceFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        allowNull: false,
        defaultValue: 'percentage'
    },

    partnerServiceFeeValue: {
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    userServiceFee: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    partnerServiceFee: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    userTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    partnerTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    paymentStatus: {
        type: DataType.ENUM('pending', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
    },

    paymentType: {
        /**
            1 => Cash
            2 => Card
            3 => Wallet"
         */
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    transactionId: {
        type: DataType.STRING
    },

    isBanStatus: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },

    isPayoutPaid: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },

    reviewDescription: {
        type: DataType.TEXT('long'),
    },

    additionalDescription: {
        type: DataType.TEXT('long'),
    },

    isTipGiven: {
        type: DataType.BOOLEAN,
        defaultValue: false
    },

    tipsAmount: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    tipsTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    tipsPartnerTotalFare: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    notes: {
        type: DataType.TEXT
    },

    userPayableFare: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false,
    },

    bookingType: {
        type: DataType.TINYINT,
        defaultValue: 1 // 1 - Normal, 2 - Schedule
    },

    isMailSent: {
        type: DataType.TINYINT,
        defaultValue: 0
    },

    createdAt: {
        type: DataType.DATE
    },

    updatedAt: {
        type: DataType.DATE
    }

});

export default Booking;