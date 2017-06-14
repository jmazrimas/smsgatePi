var cmd=require('node-cmd');

function prepGPIO(number) {
	cmd.get(
	  'gpio -g mode 21 out',
	  function(err, data, stderr){
	  	if (err) {
	  		console.log("ERROR: ", err)
	  	} else {
	  		openGPIO(number)
	  	}
	  }
	);
}

function openGPIO(number) {
	cmd.get(
	  'gpio -g write 21 1',
	  function(err, data, stderr){
	  	if (err) {
	  		console.log("ERROR: ", err)
	  	} else {
	  		setTimeout(function(){
	  			closeGPIO(number)
	  		}, 500)
	  	}
	  }
	);
}

function closeGPIO(number) {
	cmd.get(
	  'gpio -g write 21 0',
	  function(err, data, stderr){
	  	if (err) {
	  		console.log("ERROR: ", err)
	  	} else {
	  		console.log("SUCCESS: Triggered GPIO #", number)
	  	}
	  }
	);
}

module.exports = {
	triggerOpener: function() {
		prepGPIO(21);
	}
}