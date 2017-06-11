var shortid = require('shortid');
var currentkey;

module.exports = {
	generateNewKey: function() {
		currentkey = shortid.generate();
		return currentkey;
	},
	isKeyValid: function(userKey) {
		currentkey = currentkey || this.generateNewKey();
		return userKey == currentkey;
	},
	returnCurrentKey: function() {
		return currentkey;
	}
}