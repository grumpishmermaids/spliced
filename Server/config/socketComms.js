var helpers = require('./helpers.js');  //not sure if need...
var gameLogic = require('../game/gameLogic.js');

var socketIo = require('socket.io');

module.exports = function (app, server) {

  io = socketIo(server);

  io.on('connection', function (client) {
    console.log('New client connected with ID:', client.id);

    // listen for host creating game
    client.on('createGame', function (gameOptions) {
      var game = gameLogic.createGame(gameOptions);     // instantiate a game w/ game options
      client.gameCode = game.code;    // save gameCode as attribute of client 
      client.join(client.gameCode);   // connect client (game host) to 'room' named for their gameCode
      io.to(client.gameCode).emit('gameCreated', client.gameCode);   // send to everyone in game (only host at this point) newly created game info
    });

    client.on('gameInit', function() {
      io.to(client.gameCode).emit('gameInfo', gameLogic.getGame(client.gameCode));
    });


    // listen for players joining game, send them game info
    client.on('joinGame', function (joinRequest) {  // when new player joins a game
      console.log("socket.id %s requesting to join gameCode %s", client.id, joinRequest.gameCode);
      
      // attempt to add player to game (returns null if game does not exist)
      var game = gameLogic.addPlayerToGame(joinRequest.gameCode, {playerName: joinRequest.playerName, socketId: client.id});

      if (!game) {
        io.to(client.id).emit('joinFail', joinRequest.gameCode);     // send player attempting to join back a fail message
      } else {
        console.log('Game %s exists.', joinRequest.gameCode);
        client.gameCode = joinRequest.gameCode;
        client.join(client.gameCode); // connect client to socket room named their gameCode
        console.log('Connected client to room:', client.gameCode);

        io.to(client.id).emit('joinSuccess', client.gameCode);  // send new player success ping
        io.to(client.gameCode).emit('playerJoined', joinRequest.playerName);  // send "playerJoined" to everyone in game
      }
    });

    client.on('gameStart', function () {
      // do game start logic (choose game roles, etc.)
      var game = gameLogic.startGame(client.gameCode);

      // propagate start event to all players in game
      io.to(client.gameCode).emit('gameStart', game);

      // initiate game timer as well
      var countdown = gameLogic.getTimeLimit(client.gameCode);
      if (countdown) {
        var timerId = setInterval(function () {  
          countdown--;
          io.to(client.gameCode).emit('countdown', countdown);
          if (countdown <= 0) {
            io.to(client.gameCode).emit('end', null);  //TODO: endgame stuff
            clearInterval(timerId);
          }
        }, 1000);
      }
    });


    client.on('drawing', function (data) {
      console.log("'drawing' ping from socket.id %s in room %s", client.id, gameCode);
      console.log('drawer client is in socket.rooms', client.rooms);
      console.dir(client.gameCode);
      io.to(client.gameCode).emit('drawing', data);
    });


    client.on('guess', function (guess) {
      if (gameLogic.checkGuess(client.gameCode, client.id, guess)) {
        io.to(client.id).emit('bingo', null);  //TODO: send sth?
      }
    });


    // client.on('disconnect')      //TODO: implement disconnect to remove user if they drop


  });


};