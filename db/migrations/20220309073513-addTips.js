'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'isTipGiven', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn('Booking', 'tipsPartnerTotalFare', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }),
      queryInterface.addColumn('Booking', 'tipsTotalFare', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'isTipGiven'),
      queryInterface.removeColumn('Booking', 'tipsTotalFare'),
      queryInterface.removeColumn('Booking', 'tipsPartnerTotalFare'),
    ])
  }
};
