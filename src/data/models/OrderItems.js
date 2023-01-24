import DataType from 'sequelize';
import Model from '../sequelize';

const OrderItems = Model.define('OrderItems', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    categoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    subCategoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    orderId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    baseFare: {
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    },

    minimumHours: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    currency: {
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'USD'
    },

    totalQuantity: {
        type: DataType.INTEGER,
        defaultValue: 0
    },

    workedDuration: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    pausedDuration: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    startedAt: {
        type: DataType.DATE
    },

    completedAt: {
        type: DataType.DATE
    }
});

export default OrderItems;