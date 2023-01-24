import DataType from 'sequelize';
import Model from '../sequelize';

const WorkHistory = Model.define('WorkHistory', {

	id: {
		type: DataType.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},

	userId: {
		type: DataType.UUID,
		allowNull: false,
	},

	bookingId: {
		type: DataType.INTEGER,
		allowNull: false,
	},

	orderId: {
		type: DataType.INTEGER,
		allowNull: false,
	},

	orderItemId: {
		type: DataType.INTEGER,
		allowNull: false,
	},

	status: {
		type: DataType.ENUM('started', 'paused', 'resumed', 'completed'),
		allowNull: false
	},

});

export default WorkHistory;