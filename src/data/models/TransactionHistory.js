import DataType from 'sequelize';
import Model from '../sequelize';

const TransactionHistory = Model.define('TransactionHistory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    bookingId: {
        type: DataType.INTEGER,
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

    amount: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    currency: {
        type: DataType.STRING,
        allowNull: false,
    },

    transactionId: {
        type: DataType.STRING,
        allowNull: false,
    }
});

export default TransactionHistory;