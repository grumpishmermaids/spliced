var express = require('express');
var app = express();
var server = require('http').createServer(app);
// var io = require('socket.io')(server);


// configure our server with all the middleware, routing, and sockets
require('./config/middleware.js')(app, express);
require('./config/routing.js')(app);
require('./config/socketComms.js')(app, server);


var port = process.env.PORT || 4568;

server.listen(port, function(){
  console.log("Listening on: " + port);
});


module.exports = app;