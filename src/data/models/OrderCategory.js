import DataType from 'sequelize';
import Model from '../sequelize';

const OrderCategory = Model.define('OrderCategory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    orderId: {
        type: DataType.INTEGER
    },

    name: {
        type: DataType.STRING,
        allowNull: false
    },

    description: {
        type: DataType.TEXT
    },

    logoImage: {
        type: DataType.STRING
    },

    bannerImage: {
        type: DataType.STRING
    },

    isJobPhotoRequired: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    }

});

export default OrderCategory;