var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);


//////////EXPERIMENT///////////

io.on('connection', function (socket) {
  console.log('user connected with ID:', socket.id);
  socket.on('chatmsg', function (msg) {
    console.log("got msg:", msg);
    io.emit('chatmsg', msg);
  });
  socket.on('drawing', function (dataURL) {
    console.log("got drawing:", dataURL);
    io.emit('drawing', dataURL);
  });

});
//////////////////////////////////



var port = process.env.PORT || 4568;

server.listen(port, function(){
  console.log("Howdy!");
  console.log("Listening on: " + port);
});

module.exports = app;