import DataType from 'sequelize';
import Model from '../../sequelize';

const PrivilegesLink = Model.define('PrivilegesLink', {

    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    privilegeId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    url: {
        type: DataType.STRING,
        allowNull: false
    }

});

export default PrivilegesLink;