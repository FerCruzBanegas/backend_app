import DataType from 'sequelize';
import Model from '../sequelize';

const BookingTips = Model.define('BookingTips', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    bookingId: {
        type : DataType.INTEGER,
        allowNull: false,
    },

    userId: {
        type: DataType.UUID,
        allowNull: false,
    },

    partnerId: {
        type: DataType.UUID,
        allowNull: false,
    },

    paymentType : {
        type: DataType.INTEGER,
        allowNull: true,
    },

    amount: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    userCurrency: {
        type: DataType.STRING,
        allowNull: false,
    },

    partnerCurrency: {
        type: DataType.STRING,
        allowNull: false,
    },

    transactionId: {
        type: DataType.STRING
    },

});

export default BookingTips;