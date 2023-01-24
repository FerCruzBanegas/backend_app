import DataType from 'sequelize';
import Model from '../sequelize';

const Category = Model.define('Category', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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

    isPopular: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },

    isJobPhotoRequired: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
        allowNull: false
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

    pricingType: {
        type: DataType.ENUM('fixed', 'hourly'),
        allowNull: false,
        defaultValue: 'fixed'
    },

    status: {
        type: DataType.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },

    travellingPrice: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    currency: {
        type: DataType.STRING,
        defaultValue: "USD",
        allowNull: false
    }
});

export default Category;