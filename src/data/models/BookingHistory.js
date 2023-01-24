import DataType from 'sequelize';
import Model from '../sequelize';

const BookingHistory = Model.define('BookingHistory', {

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
        type: DataType.UUID
    },

    status: {
        type: DataType.ENUM('created', 'declined', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByUser', 'cancelledByPartner', 'completed', 'expired'),
        allowNull: false
    },

    pausedAt: {
        type: DataType.DATE
    },

    resumedAt: {
        type: DataType.DATE
    },

    subCategoryId: {
        type: DataType.INTEGER,
    },
});

export default BookingHistory;