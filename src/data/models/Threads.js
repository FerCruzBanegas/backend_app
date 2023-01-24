import DataType from 'sequelize';
import Model from '../sequelize';

const Threads = Model.define('Threads', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataType.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataType.UUID,
        allowNull: false
    },
    partnerId: {
        type: DataType.UUID,
        allowNull: false
    }
});

export default Threads;