'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('BookingCancelReason', 'riderId', 'userId'),
      queryInterface.renameColumn('BookingCancelReason', 'driverId', 'partnerId'),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
