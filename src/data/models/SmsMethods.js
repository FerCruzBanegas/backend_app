import DataType from 'sequelize';
import Model from '../sequelize';

const SmsMethods = Model.define('SmsMethods', {

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

    status: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    accountId: {
        type: DataType.STRING,
        allowNull: false,
    },

    securityId: {
        type: DataType.STRING,
        allowNull: false,
    },

    phoneNumber: {
        type: DataType.STRING,
        allowNull: false,
    },

    phoneDialCode: {
        type: DataType.STRING,
        allowNull: false,
    },

    phoneCountryCode: {
        type: DataType.STRING
    },

});

export default SmsMethods; 