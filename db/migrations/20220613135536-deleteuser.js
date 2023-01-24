'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('User', 'deletedBy', {
        type: Sequelize.STRING,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
