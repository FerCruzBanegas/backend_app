import DataType from 'sequelize';
import Model from '../sequelize';

const SubCategory = Model.define('SubCategory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    categoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    name: {
        type: DataType.STRING,
        allowNull: false
    },

    description: {
        type: DataType.TEXT
    },

    image: {
        type: DataType.STRING
    },

    status: {
        type: DataType.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    }
});

export default SubCategory;