import DataType from 'sequelize';
import Model from '../sequelize';

const Orders = Model.define('Orders', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    promoId: {
        type: DataType.INTEGER,
    },

    userId: {
        type: DataType.UUID,
        allowNull: false,
    },

    status: {
        type: DataType.ENUM('pending', 'processing', 'completed', 'cancelled'),
        allowNull: false
    }
});

export default Orders;