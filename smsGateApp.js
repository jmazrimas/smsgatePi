var http = require('http');
var keyController = require('./keyController');
var userController = require('./userController');
var gpioController = require('./gpioController');

var options = {
  host: 'smsgate2140.herokuapp.com',
  path: '/requests'
};

// options = 'http://localhost:5000/requests'

var pollingConfig = {
	timeout: 2000
}

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

}

processRequests = function(requests) {
	for (var i=0; i<requests.length; i++) {
		if (requestIsValid(requests[i])) {
			executeGateEvent();
			break;
		}
	}
}

requestIsValid = function(request) {
	isValid = true;
	var bodyWords = request.body.split(' ');

	for (var i=0; i<bodyWords.length; i++) {
		if (keyController.isKeyValid(bodyWords[i])) {
			isValid = true;
			break;
		}
	}
	return isValid;
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
	} else if (keyController.isKeyExpired()) {
		console.log('KEY IS EXPIRED');
		userController.sendNewKeyToUsers(keyController.generateNewKey());
	}

	pollForRequests(processRequests);

	if (killswitchTriggered()) {
		console.log("KILLSWITCH TRIGGERED");
		process.exit();
	} else {
		setTimeout(function(){
			runApp();
		},pollingConfig.timeout)
	}
}

runApp();