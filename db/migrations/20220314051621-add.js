'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('OrderSubCategory', 'subCategoryId', {
        type: Sequelize.INTEGER,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
