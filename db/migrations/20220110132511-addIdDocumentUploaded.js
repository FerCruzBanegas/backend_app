'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'isDocumentUploaded', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
