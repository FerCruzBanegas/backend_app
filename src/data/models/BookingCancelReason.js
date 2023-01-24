import DataType from 'sequelize';
import Model from '../sequelize';

const BookingCancelReason = Model.define('BookingCancelReason', {

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

    cancelStatus: {
        type: DataType.ENUM('cancelledByPartner', 'cancelledByUser'),
    },

    reason: {
        type: DataType.STRING
    }
});

export default BookingCancelReason;