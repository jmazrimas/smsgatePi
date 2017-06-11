var creds = require('./creds.json');
var accountSid = creds.twilio.accountSid;
var authToken = creds.twilio.authToken;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports = {
	currentUsers: [
		'16177339761',	//Joe
		'16178698743'	//Diana
	],
	sendNewKeyToUsers: function(newKey) {
		console.log('sendNewKeyFunc')
		// send key via twilio
		for (var i = 0; i<this.currentUsers.length; i++) {
			client.messages.create({
			    body: 'The new key is: '+newKey,
			    to: this.currentUsers[i],  // Text this number
			    from: '+16172497949' // From a valid Twilio number
			}, function(err, message) {
				if (err) {
					console.log('error')
					console.log(err)
				}
			})
			
		}
	}
}