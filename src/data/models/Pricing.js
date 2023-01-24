import DataType from 'sequelize';
import Model from '../sequelize';

const Pricing = Model.define('Pricing', {

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

    subCategoryId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    locationId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    isActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1,
        allowNull: false
    },

    currency: {
        type: DataType.STRING,
        defaultValue: "USD",
        allowNull: false
    },

    basePrice: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false
    },

    multiplierValue: { // To store minimum hour or maximum quantity
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: false
    },

    isPriceEditable: {
        type: DataType.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    }
});

export default Pricing;