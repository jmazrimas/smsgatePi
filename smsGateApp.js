var http = require('http');
var keyManager = require('./keyManager');
var userManager = require('./userManager');

var options = {
  host: 'smsgate2140.herokuapp.com',
  path: '/requests'
};

// var req = http.get(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));

//   // Buffer the body entirely for processing as a whole.
//   var bodyChunks = [];
//   res.on('data', function(chunk) {
//     // You can process streamed parts here...
//     bodyChunks.push(chunk);
//   }).on('end', function() {
//     var body = Buffer.concat(bodyChunks);
//     console.log('BODY: ' + body);
//     // ...and/or process the entire body here.
//   })
// });

// req.on('error', function(e) {
//   console.log('ERROR: ' + e.message);
// });

// keyManager.generateNewKey();
// var theKey = keyManager.returnCurrentKey();
// console.log(keyManager.isKeyValid(theKey));
// console.log(keyManager.isKeyValid("bla"));

// userManager.sendNewKeyToUsers(theKey);