'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameTable('WorkingHistory', 'WorkHistory'),
      queryInterface.addColumn('WorkHistory', 'bookingId', {
        type: Sequelize.INTEGER
      }),
      queryInterface.removeColumn('WorkHistory', 'partnerId'),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
