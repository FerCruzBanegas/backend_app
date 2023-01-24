import DataType from 'sequelize';
import Model from '../sequelize';

const UserDocument = Model.define('UserDocument', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.UUID,
        allowNull: false
    },

    imageName: {
        type: DataType.STRING,
        allowNull: false
    },

    type: {
        type: DataType.ENUM('identity', 'experience'),
        allowNull: false
    }
});

export default UserDocument;