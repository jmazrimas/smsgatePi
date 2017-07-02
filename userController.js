var creds = require('./creds.json');
var accountSid = creds.twilio.accountSid;
var authToken = creds.twilio.authToken;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var attemptKeySend = function(newKey, user, count) {
	count = count ? count : 0;
	if (count < 8) {
		client.messages.create({
		    body: 'The new key is: '+newKey,
		    to: user,  // Text this number
		    from: '+16172497949' // From a valid Twilio number
		}, function(err, message) {
			if (err) {
				console.log('error on attempt ',count)
				console.log(err)
				setTimeout(function(){
					attemptKeySend(newKey, user, count+=1)
				}, 2000)
			}
		})
	}
}

module.exports = {
	currentUsers: [
		// '16177339761',	//Joe
		// '16178698743'	//Diana
		'16177339761'	//Joe
	],
	sendNewKeyToUsers: function(newKey) {
		console.log('sendNewKeyFunc')
		// send key via twilio
		for (var i = 0; i<this.currentUsers.length; i++) {
			// attemptKeySend has recursive recovery for 8x tries
			attemptKeySend(newKey, this.currentUsers[i]);			
		}
	}
}