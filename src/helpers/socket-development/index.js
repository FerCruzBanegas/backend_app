$(function () {
	var socket = io();

	// http://localhost:4001/?id=1234&type=1

	const userSockets = ['test', 'autoCancel', 'loginCheck', 'serviceAccepted', 'arrivedLocation', 'serviceReviewed', 'serviceStarted', 'subServiceWork', 'serviceCompleted', 'serviceDeclined', 'cancelService', 'newMessage'];
	const partnerSockets = ['test', 'serviceRequest', 'arrivedLocation', 'serviceReviewed', 'serviceStarted', 'subServiceWork', 'serviceCompleted', 'cancelBooking', 'partnerLocation', 'loginCheck', 'newMessage', 'partnerApprove'];
	let userId, userType, bookingId;
	let queries = {};

	if (document && document.location && document.location.search && document.location.search.length > 0) {
		$.each(document.location.search.substr(1).split('&'), function (c, q) {
			var i = q.split('=');
			queries[i[0].toString()] = i[1].toString();
		});
	}

	userId = queries && queries.id;
	userType = queries && queries.type;
	bookingId = queries && queries.bookingId;

	if (userId) { $('#userId').val(userId); }
	if (userType) { $('#userType').val(userType); }

	$('form').submit(function (e) {
		e.preventDefault();
		let eventName = $('#eventName').val() || null;
		let data = $('#data').val() || null;

		let html = '<b>' + eventName + ': </b>';
		html = html + '<span>' + JSON.stringify(data) + '</span>';

		if (userType == '1' && userSockets.indexOf(eventName) >= 0) { // User Client 

			socket.emit(eventName, data);
			$('#responseData').append($('<li class="request">').html(html));

		} else if (userType == '2' && partnerSockets.indexOf(eventName) >= 0) { // Partner Client

			socket.emit(eventName, data);
			$('#responseData').append($('<li class="request">').html(html));

		} else {
			alert("Hey buddy! you are trying an invalid request!!!");
		}

		clearFields(); // Clear the form fields
		return false;
	});

	$('#clear').click(function () { // Clear the logs
		$('#responseData').empty();
		window.scrollTo(0, 0);
	});

	function clearFields() { // Clear the fields
		$('#data').val('');
	}

	socket.on('connect', function () {
		$('#responseData').append($('<li class="response">').text('connected with socket: ' + socket.id));
	});

	if (userId) {
		if (userType == '1') { // user events

			// Receive - serviceAccepted
			socket.on('serviceAccepted-' + userId, async function (responseData) {
				let html = '<span class="eventName">serviceAccepted-' + userId + ': </span>';
				html = html + '<span>' + responseData + '</span>';

				$('#responseData').append($('<li class="response">').html(html));
			});

			// Receive - serviceDeclined
			socket.on('serviceDeclined-' + userId, async function (responseData) {
				let html = '<span class="eventName">serviceDeclined-' + userId + ': </span>';
				html = html + '<span>' + responseData + '</span>';

				$('#responseData').append($('<li class="response">').html(html));
			});


		} else { // Partner events

			// Receive - New-request/
			socket.on('serviceRequest-' + userId, async function (responseData) {
				let html = '<span class="eventName">serviceRequest-' + userId + ': </span>';
				html = html + '<span>' + JSON.stringify(responseData) + '</span>';
				$('#responseData').append($('<li class="response">').html(html));
			});

			socket.on('partnerApprove-' + userId, async function (responseData) {
				let html = '<span class="eventName">partnerApprove-' + userId + ': </span>';
				html = html + '<span>' + JSON.stringify(responseData) + '</span>';

				$('#responseData').append($('<li class="response">').html(html));
			});

		}

		// Arrived Booking
		socket.on('arrivedLocation-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">arrivedLocation-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// Arrived Booking
		socket.on('serviceReviewed-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">serviceReviewed-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// Service Started
		socket.on('serviceStarted-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">serviceStarted-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// SubService Work
		socket.on('subServiceWork-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">subServiceWork-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// Service Completed
		socket.on('serviceCompleted-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">serviceCompleted-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// Service Cancelled
		socket.on('cancelService-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">cancelService-' + bookingId + ': </span>';
			html = html + '<span>' + responseData + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// PartnerLocation - Error/Success
		socket.on('partnerLocation-' + bookingId, async function (responseData) {
			let html = '<span class="eventName">partnerLocation-' + userId + ': </span>';
			html = html + '<span>' + JSON.stringify(responseData) + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		// Receive - Error/Success
		socket.on('loginCheck-' + userId, async function (responseData) {
			let html = '<span class="eventName">loginCheck-' + userId + ': </span>';
			html = html + '<span>' + JSON.stringify(responseData) + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		socket.on('testRequest-' + userId, async function (responseData) {
			let html = '<span class="eventName">testRequest-' + userId + ': </span>';
			html = html + '<span>' + JSON.stringify(responseData) + '</span>';

			$('#responseData').append($('<li class="response">').html(html));
		});

		if (bookingId) {
			socket.on('newMessage-' + bookingId, async function (responseData) {
				let html = '<span class="eventName">newMessage-' + bookingId + ': </span>';
				html = html + '<span>' + JSON.stringify(responseData) + '</span>';

				$('#responseData').append($('<li class="response">').html(html));
			});
		}

	}
});