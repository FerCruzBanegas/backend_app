import DataType from 'sequelize';
import Model from '../sequelize';

const UserProfile = Model.define('UserProfile', {

  profileId: {
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataType.UUID
  },

  firstName: {
    type: DataType.STRING,
  },

  lastName: {
    type: DataType.STRING,
  },

  picture: {
    type: DataType.STRING,
  },

  lat: {
    type: DataType.FLOAT,
  },

  lng: {
    type: DataType.FLOAT,
  },

  state: {
    type: DataType.STRING,
  },

  city: {
    type: DataType.STRING,
  },

  zipcode: {
    type: DataType.STRING,
  },

  country: {
    type: DataType.STRING,
  },

  preferredCurrency: {
    type: DataType.STRING,
    defaultValue: "USD"
  },

  preferredLanguage: {
    type: DataType.STRING,
    defaultValue: "en"
  },

  preferredPaymentMethod: {
    /**
      1 => Cash 
      2 => Card
      3 => Wallet"
     */
    type: DataType.TINYINT,
    defaultValue: 1
  },

  paymentCustomerId: {
    type: DataType.STRING
  },

  cardLastFour: {
    type: DataType.INTEGER,
  },

  cardToken: {
    type: DataType.STRING(255),
  },

  walletBalance: {
    type: DataType.FLOAT,
    defaultValue: 0
  },

  walletUsed: {
    type: DataType.FLOAT,
    defaultValue: 0
  },

  paymentMethodId: {
    type: DataType.STRING,
    defaultValue: 0
  },

  experienceDescription: {
    type: DataType.TEXT('long')
  },

  preferredLat: {
    type: DataType.FLOAT
  },

  preferredLng: {
    type: DataType.FLOAT
  },

  preferredLocation: {
    type: DataType.STRING
  },

  address: {
    type: DataType.TEXT('long')
  },

  preferredType: {
    type: DataType.STRING
  },

  isDocumentUploaded: {
    type: DataType.BOOLEAN,
    defaultValue: false
  },

});

export default UserProfile;
