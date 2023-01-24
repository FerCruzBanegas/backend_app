'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('SMSVerification', 'userType', {
        type: Sequelize.INTEGER,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
