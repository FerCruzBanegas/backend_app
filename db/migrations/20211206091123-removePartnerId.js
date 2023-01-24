'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Orders', 'partnerId'),
      queryInterface.addColumn('UserProfile', 'preferredLat', { type: Sequelize.FLOAT }),
      queryInterface.addColumn('UserProfile', 'preferredLng', { type: Sequelize.FLOAT }),
      queryInterface.addColumn('UserProfile', 'preferredLocation', { type: Sequelize.STRING })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'jobLat'),
      queryInterface.removeColumn('UserProfile', 'jobLng'),
      queryInterface.removeColumn('UserProfile', 'jobLocation'),
    ])
  }
};
