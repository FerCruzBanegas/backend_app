'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('BookingTips', 'riderId', 'userId'),
      queryInterface.renameColumn('BookingTips', 'driverId', 'partnerId'),
      queryInterface.renameColumn('BookingTips', 'riderCurrency', 'userCurrency'),
      queryInterface.renameColumn('BookingTips', 'driverCurrency', 'partnerCurrency'),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
