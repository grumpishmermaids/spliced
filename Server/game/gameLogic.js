// var fs = require('fs');
// var db = require('../DB/DB.js');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
var Game = require('../models/Game.js');
var Player = require('../models/Player.js');


// we don't really need to save anything yet
// so it's fine to store everything in server memory for now
var activeGames = {};


var createGame = function (options) {
  var newCode = createUniqueGameCode();
  var newGame = new Game(newCode, options);
  activeGames[newGame.code] = newGame;
  return newGame;
};

var addPlayerToGame = function (gameCode, playerOptions) {
  var game = activeGames[gameCode] || null;
  if (game !== null) {
    game.addPlayer(playerOptions);
  }
  return game;
};

var getTimeLimit = function (gameCode) {
  return activeGames[gameCode].timeLimit;
};

var startGame = function (gameCode) {
  return activeGames[gameCode].startGame();
};

var checkGuess = function (gameCode, player, guess) {
  return activeGames[gameCode].checkGuess(player, guess);
};


var gameCodeInUse = function (gameCode) {
  return (activeGames[gameCode] !== undefined);
};

var createUniqueGameCode = function () {  //TODO: guarantee unique?
  var code = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  while (true) {
    code = "";
    for( var i=0; i < 4; i++ ) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log("checking code:", code);
    if (!gameCodeInUse(code)) {
      console.log("unique code found!");
      return code;
    }
  }
  return null;
};





module.exports = {
  createGame: createGame,
  createUniqueGameCode: createUniqueGameCode,
  addPlayerToGame: addPlayerToGame,
  getTimeLimit: getTimeLimit
};



// module.exports = {
// //Create a new player for a specific game.
//   createPlayer: function (req, res, game, code, callback) {

//     var userName = game.player_count;
//     console.log("When we create the player, the code is", code);

//     // add this player to the database.
//     db.player.findOneAndUpdate({user_name: userName, game_code: code}, {user_name: userName, counted: false, game_code: code, started_drawing: true}, {upsert: true, 'new': true}, function (err, player) {
//       // console.log("New player", userName, "Has been added to game:", code);
//       // console.log("We are making cookies!");
//       res.cookie(code + '_playerName', player.user_name, { maxAge: 900000, httpOnly: false});
//       res.cookie(code + '_playerID', player._id,{ maxAge: 900000, httpOnly: false});
//       res.cookie(code, true, { maxAge: 900000, httpOnly: false});
//       req.session.user = player._id;
//       // console.log("The cookies are:", res.cookie);
//       // once the player has been added, we'll update the game table with the new player's info
//       // this update also includes count++
//       // console.log("We're creating the player. the Player is:", player);
//       var gameObj = {};
//       gameObj.$inc = {'player_count':1};
//       gameObj[userName] = player.id;
//       console.log("Console logging gameObj", gameObj);
//       db.game.findOneAndUpdate({game_code: code}, gameObj, function(err, game){
//         if(err){
//           console.log(err);
//         } else {
//           // console.log("GET GAME: This is the game data", game);
//           // send game back to client.
//           res.cookie('templateId', game.template,{ maxAge: 900000, httpOnly: false});
//           res.send({game: game, player: player});
//           if(callback){
//             callback(player);
//           }
//         }

//       });
//     });
//   },

//   getPlayerSession: function(req, res, code) {
//     // check if the user has submitted their drawing.
//     console.log("-----------------------");
//     console.log("getting the player session...");
//     console.log("-----------------------");
//     console.log(req.cookies);
//     var username = req.cookies[code + '_playerID'];
//     console.log('username is', username);
//     db.player.findOne({game_code: code, _id: username}, function(err, player) {
//       console.log("inside db.player.findOne in getPlayerSession");
//       if (err) console.log("There was an error finding the user by their ID", err)
//       // if the user has submitted their drawing
//       if (player) {
//         if (player.submitted_drawing) {
//           // show them a please wait screen (perhaps with a reload button so they can see the final image)
//           console.log("The player has submitted a drawing. Let's not let them make a new drawing");
//           var codeAndDrawingStatus = code + '_' + 'submitted_drawing';
//           var responseObj = {};
//           responseObj[codeAndDrawingStatus] = true;
//           res.send(responseObj);
//         } else if (!player.submitted_drawing && player.started_drawing) {
//           console.log("The player has started drawing, but hasn't submitted yet.");
//           var codeAndDrawingStatus = code + '_' + 'submitted_drawing';
//           var responseObj = {};
//           responseObj[codeAndDrawingStatus] = false;
//           res.send(responseObj);
//         }
//         console.log(player);
//       }
//     });
//   },

//   createUniqueGameCode: function(){

//     var code = "";
//     var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
//     var foundUnique = false;

//       for( var i=0; i < 4; i++ ) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//       }

//     return text;

//   },

//   createNewGame: function(res){
//     var code = this.createUniqueGameCode();
//     var randomTemplateNumber = Math.floor(Math.random() * 5);
//     var game = new db.game({game_code: code, num_players: 4, player_count: 0, submission_count: 0, game_started: true, drawing_finished: false, 0: null, 1: null, 2: null, 3: null, template: randomTemplateNumber}).save();
//     console.log("the unique code is:" + code);
//     res.send(code);
//   },

//   //update a game if it already exists
//   updateGame: function(player, gameCode, res, callback) {
//     //create a new game object
//     var gameObj = {};
//     console.log('player.id is ', player._id);
//     // console.log('player.id is ', player.id);
//     gameObj[player.user_name] = player._id;
//     // console.log('gameObj[player.user_name] is ', gameObj[player.user_name]);
//     //if the player has never submitted a drawing...
//     if(!player.counted){
//       //increment number of submitted drawings
//       gameObj.$inc = {'submission_count':1};
//       //update the player to know they have been counted
//       db.player.findOneAndUpdate({user_name: player.user_name, game_code: gameCode}, {counted: true}, {upsert: true, 'new': true}, function (err, player) {
//         console.log("Player count updated.");
//       });
//       //update the game with the new player information
//       db.game.findOneAndUpdate({game_code: gameCode}, gameObj, {upsert: true, 'new': true}, function (err, game){
//         //if all players have submitted drawings
//         console.log('Game count VS number of players', game.submission_count, game.num_players);
//         console.log("The gameObj", gameObj);
//         if (game.submission_count === game.num_players) {
//           console.log("Let's invoke the image stitcher function now");
//           // invoke create unified image function
//           module.exports.makeImages(gameCode, game.num_players, function() {
//             if (err) throw err;
//             console.log("Done drawing the image, check the image folder!");
//             if(callback){
//               callback();
//             }
//           });
//         }
//       });
//     }
//     console.log("I'm sending the status now!");
//     return res.sendStatus(201);

//   },

//   resolveFinishedGame: function (game) {
//     if (game.drawing_finished) {
//       // if the drawing is completed
//       this.checkFinalImage(game.game_code, function() {
//         var imageURL = '/client/uploads' + game.game_code + '.png';
//         // we need to send it back.
//         res.send({imageURL: imageURL});
//       });
//     } else {
//       res.sendStatus(500);
//       // if the drawing got messed up or never got completed
//         // we will try to draw it again.
//     }
//   }
// };