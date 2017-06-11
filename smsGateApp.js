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
	for (var i=0; i<requests.length; i++) {
		console.log(requests[i])
	}
}

runApp = function() {
	console.log('BEGIN APP RUN '+ Math.floor(new Date() / 1000))

	if (!keyManager.isKeyDefined()) {
		console.log('KEY IS NOT DEFINED');
		keyManager.generateNewKey();
		keyManager.returnCurrentKey()
	} else if (keyManager.isKeyExpired()) {
		console.log('KEY IS EXPIRED');
		keyManager.generateNewKey();
		keyManager.returnCurrentKey()
	}

	pollForRequests(processRequests);

	setTimeout(function(){
		runApp();
	},pollingConfig.timeout)
}

runApp();


// keyManager.generateNewKey();
// var theKey = keyManager.returnCurrentKey();
// console.log(keyManager.isKeyValid(theKey));
// console.log(keyManager.isKeyValid("bla"));

// userManager.sendNewKeyToUsers(theKey);