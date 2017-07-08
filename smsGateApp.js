var http = require('http');
var keyController = require('./keyController');
var userController = require('./userController');
var gpioController = require('./gpioController');

var options = {
  host: 'smsgate2140.herokuapp.com',
  // path: '/requests'
  path: '/requests/last'
};

// options = 'http://localhost:5000/requests'

var pollingConfig = {
	timeout: 2000
}

var lastRequestTime = Date.parse(new Date());

pollForRequests = function(callback) {
	var body = [];

	var req = http.get(options, function(res) {
		var bodyChunks = [];
	  res.on('data', function(chunk) {
	    bodyChunks.push(chunk);
	  }).on('end', function() {
		  body = Buffer.concat(bodyChunks);
		  callback(JSON.parse(body));
	  })
	});
	
	req.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});

	console.log('POLL COMPLETE')

}

processRequests = function(requests) {
	for (var i=0; i<requests.length; i++) {
		if (requestIsValid(requests[i])) {
			executeGateEvent();
			break;
		}
	}
}

processRequest = function(request) {
	if (requestIsNew(request)) {
		console.log('NEW REQUEST')
		lastRequestTime = Date.parse(Date(request.createdAt));
		if (requestIsValid(request)) {
			executeGateEvent();
		}
	} else {
		console.log('NO NEW REQUESTS')
	}
}

requestIsValid = function(request) {
	isValid = false;
	var bodyWords;
	if (request.body) {
		bodyWords = request.body.split(' ');
	} else {
		bodyWords = request.message.split(' ');
	}
	

	for (var i=0; i<bodyWords.length; i++) {
		if (keyController.isKeyValid(bodyWords[i])) {
			isValid = true;
			break;
		}
	}
	return isValid;
}

requestIsNew = function(request) {
	return lastRequestTime < Date.parse(request.createdAt);
}

var runningRequestLog = []
executeGateEvent = function() {
	if (runningRequestLog.length >= 10) {
		runningRequestLog.shift();
	}
	runningRequestLog.push(Math.floor(new Date() / 1000))
	gpioController.triggerOpener();
}

killswitchTriggered = function() {	
	var triggered = false;

	if (runningRequestLog.length > 9) {
		var timeFromOldestRequest = Math.floor(new Date() / 1000) - runningRequestLog[0];
		if (timeFromOldestRequest < 60) {
			triggered = true;
		}
	}

	return triggered;
}

runApp = function() {
	console.log('BEGIN APP RUN '+ Math.floor(new Date() / 1000))

	if (!keyController.isKeyDefined()) {
		console.log('KEY IS NOT DEFINED');
		userController.sendNewKeyToUsers(keyController.generateNewKey());
		// reset key when its expired AND its the middle of the day
	} else if (keyController.isKeyExpired() && new Date().getUTCHours() == 17) {
		console.log('KEY IS EXPIRED, RENEWING');
		userController.sendNewKeyToUsers(keyController.generateNewKey());
	}

	pollForRequests(processRequest);

	if (killswitchTriggered()) {
		console.log("KILLSWITCH TRIGGERED");
		process.exit();
	} else {
		setTimeout(function(){
			console.log('BEGIN NEXT RUN')
			runApp();
		},pollingConfig.timeout)
	}
}

runApp();