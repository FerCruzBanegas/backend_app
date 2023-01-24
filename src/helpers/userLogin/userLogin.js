import {
	UserLogin,
	User
} from '../../data/models';

// Getting user login information
const createUserLogin = async (userToken, userId, deviceId, deviceType, userType, isActive) => {
	try {
		let where = {
			userId,
			userType
		};

		let deviceLoginExist = await UserLogin.findAll({
			attributes: ['id'],
			where
		});

		if (deviceLoginExist && deviceLoginExist.length > 0) {
			const removeLogin = await UserLogin.destroy({
				where
			});

			const creatUserLogin = await UserLogin.create({
				key: userToken,
				userId,
				deviceType,
				deviceId,
				userType
			});

			let changeEverything = await User.update({
				isActive
			}, {
				where: {
					id: userId
				}
			});
		} else {
			const creatUserLogin = await UserLogin.create({
				key: userToken,
				userId,
				deviceType,
				deviceId,
				userType
			});
		}
	} catch (error) {
		console.log('getUserLoginData Error: ', error);
		return null;
	}
};

module.exports = {
	createUserLogin
};