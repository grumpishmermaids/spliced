var helpers = require('./helpers.js');  //not sure if need...
var gameLogic = require('../game/gameLogic.js');



var socketIo = require('socket.io');


module.exports = function (app, server) {

  io = socketIo(server);

  io.on('connection', function (client) {

    console.log('New user connected with ID:', client.id);

    // listen for host creating game, instantiate game instance on server, propagate start signal
    client.on('createGame', function (gameOptions) {
      // var game = gameLogic.createGame(gameOptions);     // instantiate a game w/ game options
      client.join('BEASTA');      // connect creator (this client) to socket room named their gameCode
      io.to('BEASTA').emit('gameCreated', 'BEASTA');   // send to everyone in game (only host at this point) newly created game info
    });

    // client.on('createGame', function (gameOptions) {
    //   // var game = gameLogic.createGame(gameOptions);     // instantiate a game w/ game options
    //   client.join('BEASTA');      // connect creator (this client) to socket room named their gameCode
    //   io.to('BEASTA').emit('gameCreated', 'BEASTA');   // send to everyone in game (only host at this point) newly created game info
    // });


    // listen for players joining game, send them game info
    client.on('joinGame', function (gameCode, playerOptions) {  // when new player joins a game
      console.log("'joinGame' ping from socket.id %s requesting gameCode %s", client.id, gameCode);
      client.join(gameCode); // connect client to socket room named their gameCode
      console.log('host client is in socket.rooms', client.rooms);
      var game = gameLogic.addPlayerToGame(gameCode, playerOptions);
      if (!game) {
        io.to(client.id).emit('joinFail', gameCode);     // send player attempting to join back a fail message
      } else {
        io.to(client.id).emit('joinSuccess', {gameCode: gameCode});                         // send new player success ping
        io.to(gameCode).emit('playerJoined', {gameCode: gameCode, player: playerOptions});  // send "playerJoined" to everyone in game
      }
    });


    client.on('gameStart', function () {
      // propagate start event to all players in game
      var gameCode = io.sockets.manager.roomClients[client.id];
      io.to(gameCode).emit('start');

      // initiate game timer as well
      var countdown = gameLogic.getTimeLimit(gameCode);
      if (countdown) {
        var timerId = setInterval(function () {  
          countdown--;
          io.to(gameCode).emit('countdown', countdown);
          if (countdown <= 0) {
            io.to(gameCode).emit('end', null);  //TODO: endgame stuff
            clearInterval(timerId);
          }
        }, 1000);
      }
    });


    client.on('drawing', function (data) {
      var gameCode = io.sockets.adapter.sids[client.id];
      console.log("'drawing' ping from socket.id %s in room %s", client.id, gameCode);
      console.log('drawer client is in socket.rooms', client.rooms);
      console.dir(gameCode);
      io.to(gameCode).emit('drawing', data);
    });


    client.on('guess', function (player, guess) {
      if (gameLogic.checkGuess(gameCode, player, guess)) {
        io.to(client.id).emit('bingo', null);  //TODO: send sth?
      }
    });


    // client.on('disconnect')      //TODO: implement disconnect to remove user if they drop


  });


};