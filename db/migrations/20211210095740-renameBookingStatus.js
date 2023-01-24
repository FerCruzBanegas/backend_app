'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'status', {
        type: Sequelize.ENUM('created', 'declined', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByUser', 'cancelledByPartner', 'completed', 'expired'),
        allowNull: false
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
