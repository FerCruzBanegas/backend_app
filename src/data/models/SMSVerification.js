import DataType from 'sequelize';
import Model from '../sequelize';

const SMSVerification = Model.define('SMSVerification', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    phoneNumber: {
        type: DataType.STRING,
        allowNull: false
    },

    phoneDialCode: {
        type: DataType.STRING,
        allowNull: false
    },

    userId: {
        type: DataType.UUID,
    },

    deviceId: {
        type: DataType.TEXT
    },

    deviceType: {
        type: DataType.TEXT
    },

    otp: {
        type: DataType.INTEGER
    },

    userType: {
        /**
          1 - Indicates User
          2 - Indicates Service Provider"
         */
        type: DataType.TINYINT,
    },


    createdAt: {
        type: DataType.DATE
    },

    updatedAt: {
        type: DataType.DATE
    }

});

export default SMSVerification;