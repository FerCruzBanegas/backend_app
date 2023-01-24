import DataType from 'sequelize';
import Model from '../sequelize';

const WorkLogHistory = Model.define('WorkLogHistory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.UUID,
        allowNull: false,
    },

    bookingId: {
        type: DataType.INTEGER,
        allowNull: false,
    },

    orderId: {
        type: DataType.INTEGER,
        allowNull: false,
    },

    orderItemId: {
        type: DataType.INTEGER,
        allowNull: false,
    },

    startedAt: {
        type: DataType.DATE,
    },

    closedAt: {
        type: DataType.DATE,
    },

    status: {
        type: DataType.ENUM('paused', 'completed'),
    },

    totalDuration: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

});

export default WorkLogHistory;