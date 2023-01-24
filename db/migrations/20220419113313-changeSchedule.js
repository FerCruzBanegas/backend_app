'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('BookingHistory', 'status', {
        type: Sequelize.ENUM('created', 'declined', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByUser', 'cancelledByPartner', 'completed', 'expired', 'scheduled'),
        allowNull: false
      }),
      queryInterface.changeColumn('Booking', 'status', {
        type: Sequelize.ENUM('created', 'declined', 'approved', 'arrived', 'reviewed', 'started', 'cancelledByUser', 'cancelledByPartner', 'completed', 'expired', 'scheduled'),
        allowNull: false
      }),
      queryInterface.addColumn('Booking', 'bookingType', {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      }),
      queryInterface.renameColumn('ScheduleBooking', 'riderId', 'userId'),
      queryInterface.renameColumn('ScheduleBooking', 'tripStatus', 'status'),
      queryInterface.renameColumn('ScheduleBookingHistory', 'tripStatus', 'status'),

    ])
  },

  down: (queryInterface, Sequelize) => {

  }
};
