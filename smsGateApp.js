var http = require('http');
var keyManager = require('./keyManager');
var userManager = require('./userManager');

var options = {
  host: 'smsgate2140.herokuapp.com',
  path: '/requests'
};

options = 'http://localhost:5000/requests'

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
		callback(JSON.parse(body));
	});

}

processRequests = function(requests) {
	console.log("REQUESTS: "+requests)
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
		if (keyManager.isKeyValid(bodyWords[i])) {
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

	if (!keyManager.isKeyDefined()) {
		console.log('KEY IS NOT DEFINED');
		keyManager.generateNewKey();
		console.log(keyManager.returnCurrentKey());
	} else if (keyManager.isKeyExpired()) {
		console.log('KEY IS EXPIRED');
		keyManager.generateNewKey();
		keyManager.returnCurrentKey()
		console.log(keyManager.returnCurrentKey());
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


// keyManager.generateNewKey();
// var theKey = keyManager.returnCurrentKey();
// console.log(keyManager.isKeyValid(theKey));
// console.log(keyManager.isKeyValid("bla"));

// userManager.sendNewKeyToUsers(theKey);