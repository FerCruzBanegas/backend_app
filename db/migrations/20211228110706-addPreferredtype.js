'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'preferredType', { type: Sequelize.STRING }),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
