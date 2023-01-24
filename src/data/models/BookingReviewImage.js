import DataType from 'sequelize';
import Model from '../sequelize';

const BookingReviewImage = Model.define('BookingReviewImage', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    orderId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    imageName: {
        type: DataType.STRING,
        allowNull: false
    }

});

export default BookingReviewImage;