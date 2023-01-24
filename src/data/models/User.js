import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define('User', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    allowNull: false,
  },

  phoneNumber: {
    type: DataType.STRING,
    allowNull: false,
  },

  phoneDialCode: {
    type: DataType.STRING,
    allowNull: false,
  },

  phoneCountryCode: {
    type: DataType.STRING
  },

  lat: {
    type: DataType.FLOAT
  },

  lng: {
    type: DataType.FLOAT
  },

  userStatus: { //Document Approved
    type: DataType.ENUM('pending', 'active', 'inactive'),
    defaultValue: 'pending',
  },

  isActive: {
    type: DataType.BOOLEAN, //Online or Offline
    defaultValue: false,
    allowNull: false
  },

  isBan: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  userType: {
    /**
      1 - Indicates User
      2 - Indicates Service Provider"
     */
    type: DataType.TINYINT,
    defaultValue: 1
  },

  activeStatus: { //Active means booking can be assigned to partner. Inactive means booking already assigned to partner
    type: DataType.ENUM('active', 'inactive')
  },

  overallRating: {
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  },

  deletedAt: {
    type: DataType.DATE,
    defaultValue: null
  },

  deletedBy: {
    type: DataType.STRING,
    defaultValue: null
  },

  userTypeUpdatedAt: {
    type: DataType.DATE,
  },

  deletedBy: {
    type: DataType.STRING,
    defaultValue: null
  },

}, {
  indexes: [
    { fields: ['email'] },
  ],
});

export default User;

