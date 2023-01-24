// Config
import { environment } from '../config';
// JWT Authentication
import { socketVerifyJWT_MW } from '../libs/socketMiddleware';
// Helpers

import { autoCancel } from './helpers/autoCancel';

const __DEV__ = environment;

const connection = (app, io) => {
	io.on('connection', function (socket) {
		socket.on('disconnecting', (reason) => {
			console.log('disconnecting');
		});

		if (__DEV__) {
			/* Test Socket event */
			/*
			User:-

			http://localhost:4001/?id=<userID>&type=1

			Partner:-

			http://localhost:4001/?id=<userID>&type=2

			*/
			socket.on('test', async function (requestData) {
				let formattedRequest = JSON.parse(requestData);
				io.emit("testRequest-" + formattedRequest.id, formattedRequest);
			});
		}

		socket.on('disconnect', function () {
			console.log('Disconnect', socket.id);
		});

		/*****
		* The rider auto cancels the trip request
		*****/
		socket.on('autoCancel', async function (requestData) {
			let formattedRequest = JSON.parse(requestData);
			let authCheck = socketVerifyJWT_MW(formattedRequest.data);
			let responseData;
			if (authCheck && authCheck.status === 200) {
				responseData = await autoCancel(formattedRequest);
				if (responseData && responseData.status === 200) {
					io.emit('autoCancel-' + responseData.data.id, { data: responseData }); // Request to the rider(Success response)
				} else {
					io.emit('autoCancel-' + formattedRequest.data.userId, { data: responseData }); // Request to the rider(Error Reponse)
				}
			} else {
				io.emit('autoCancel-' + formattedRequest.data.userId, { // Request to Rider(Authentical Fail)
					data: authCheck
				});
			}
		});

	});
};

export default connection;