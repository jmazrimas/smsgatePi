var shortid = require('shortid');
var currentkey;
var keyDefinedAt;

module.exports = {
	generateNewKey: function() {
		currentkey = shortid.generate();
		keyDefinedAt = Math.floor(new Date() / 1000);
		return currentkey;
	},
	isKeyValid: function(userKey) {
		currentkey = currentkey || this.generateNewKey();
		return userKey == currentkey;
	},
	returnCurrentKey: function() {
		return currentkey;
	},
	isKeyExpired: function() {
		var timeNowInt = Math.floor(new Date() / 1000)
		return (timeNowInt - keyDefinedAt) > 86400;
	},
	isKeyDefined: function() {
		return !!currentkey;
	}
}