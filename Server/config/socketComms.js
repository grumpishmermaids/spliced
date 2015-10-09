var helpers = require('./helpers.js');  //not sure if need...
var gameLogic = require('../game/gameLogic.js');

var socketIo = require('socket.io');

module.exports = function (app, server) {

  io = socketIo(server);

  io.on('connection', function (client) {
    console.log('New client connected with ID:', client.id);

    // listen for host creating game
    client.on('createGame', function (gameOptions) {
      console.log("game %s: received 'createGame'", client.gameCode);
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
        console.log('game %s: Connected %s to room:', client.gameCode, joinRequest.playerName);

        io.to(client.id).emit('joinSuccess', client.gameCode);  // send new player success ping
        io.to(client.gameCode).emit('playerJoined', joinRequest.playerName);  // send "playerJoined" to everyone in game
      }
    });

    client.on('gameStart', function () {
      console.log("game %s: received 'gameStart' signal", client.gameCode);
      var game = gameLogic.getGame(client.gameCode);

      // if players joined >= panels, we can start game
      if (game.nextAvailablePlayerId >= game.numTiles) {
        // do game start logic (choose game roles, etc.)
        game = gameLogic.startGame(client.gameCode);

        // send whole game object back to host
        io.to(client.id).emit('gameStart', game);

        // propagate start event to all players in game
        // individualized to their role (& panelid if drawer)
        for (var i=0; i<game.nextAvailablePlayerId; i++) {
          console.log("game %s: sending 'gameStart' to player %s with role %s and panel %s", client.gameCode, client.id, game.players[i].role, game.players[i].panelId);
          io.to(game.players[i].socketId).emit('gameStart', {
            role: game.players[i].role,
            panelId: game.players[i].panelId,
            prompt: (game.players[i].role === "drawer") ? game.prompt : ""
          });
        }
        
        // initiate game timer as well
        var countdown = gameLogic.getTimeLimit(client.gameCode);
        console.log("Initiating countdown for %d", client.gameCode);
        if (countdown) {
          var timerId = setInterval(function () {  
            countdown--;
            console.log("game %s: sending 'countdown' %s", client.gameCode, countdown);
            io.to(client.gameCode).emit('countdown', countdown);
            if (countdown <= 0) {
              io.to(client.gameCode).emit('end', "Time up!");  //TODO: endgame stuff
              clearInterval(timerId);
            }
          }, 1000);
        }
      } else {
        //if insufficent players, send back fail message
        console.log("game %s: sending 'insufficentPlayers'. need %s more.", client.gameCode, game.numTiles - game.nextAvailablePlayerId);
        io.to(client.id).emit('insufficientPlayers',  game.numTiles - game.nextAvailablePlayerId);
      }

    });

    client.on('tellMeASecret', function (whocares) {
      var game = gameLogic.getGame(client.gameCode);
      if (game.playersBySocket[client.id].role === "drawer") {
        io.to(client.id).emit('barryNeverTells', {
          prompt: game.prompt,
          panelId: game.playersBySocket[client.id].panelId
        });
      }
    });

    client.on('drawing', function (data) {
      console.log("'drawing' ping from socket.id %s in room %s", client.id, client.gameCode);
      var game = gameLogic.getGame(client.gameCode);
      data.panelId = game.playersBySocket[client.id].panelId;
      console.log("data.panelId: ", data.panelId);
      console.log("-------------------------------------------",client.gameCode);
      io.to(client.gameCode).emit('drawing', data);
    });


    client.on('guess', function (guess) {
      console.log("received 'guess' %s from socket %s", guess, client.id);
      var result = gameLogic.submitGuess(client.gameCode, client.id, guess);
      // relay guess/player/bingo to gameCode room so host can display it
      io.to(gameCode).emit('guess', {
        guess: guess, 
        player: result.player, 
        bingo: result.bingo
      });
      if (result.bingo === true) {
        console.log("sending BINGO! to", client.id);
        io.to(client.id).emit('bingo', null);  //TODO: send sth?
        // propagate 'end' event if gameOver b/c max correct guesses
        if (result.gameOver) {
          io.to(client.gameCode).emit('end', "Max correct guesses reached!");
        }
      }
    });


    // client.on('disconnect')      //TODO: implement disconnect to remove user if they drop


  });


};