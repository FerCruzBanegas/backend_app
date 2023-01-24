import DataType from 'sequelize';
import Model from '../sequelize';

const OrderSubCategory = Model.define('OrderSubCategory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    orderId: {
        type: DataType.INTEGER
    },

    categoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    subCategoryId: {
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

export default OrderSubCategory;