'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
return Promise.all([
      queryInterface.sequelize.query("UPDATE SiteSettings set title = 'Partner Android App' ,name = 'sleepPartnerAndroid' where name='sleepDriverAndroid';"),
      queryInterface.sequelize.query("UPDATE SiteSettings set title='Partner iOS App' ,name = 'sleepPartnerios' where name='sleepDriverios';"),
])
      
  },

  down: (queryInterface, Sequelize) => {
    return true;
  }
};
