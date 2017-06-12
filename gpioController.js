var gpio = require("pi-gpio");

module.exports = {
	triggerOpener: function() {
		gpio.open(7, "output", function(err) {		// Open pin 16 for output
			gpio.write(7, 1, function() {			// Set pin 16 high (1)
				gpio.close(16);						// Close pin 16
			});
		});
	}
}