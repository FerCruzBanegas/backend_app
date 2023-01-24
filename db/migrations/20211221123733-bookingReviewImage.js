'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('BookingReviewImage', 'bookingId', 'orderId'),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
