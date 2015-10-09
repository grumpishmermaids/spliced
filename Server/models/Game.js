var gameLogic = require('../game/gameLogic.js');
var getRandomPrompt = require('../game/prompts.js');
var Player = require('../models/Player.js');


var Game = function (gameCode, options) {
  this.code = gameCode;
  this.prompt = getRandomPrompt();
  this.name = options.name || "AWESOME SPLICED GAME";
  this.numTiles = options.numTiles || 4;
  this.timeLimit = options.timeLimit || null;
  // this.maxPlayers = options.maxPlayers || null;
  this.nextAvailablePlayerId = 0;
  this.playersBySocket = {};
  this.players = [];
};

Game.prototype.constructor = Game;

Game.prototype.addPlayer = function (playerOptions) {
  // give player a simple id within game (for game logic)
  playerOptions.playerId = this.nextAvailablePlayerId;
  this.nextAvailablePlayerId++;

  // use their socketId as identifying key in player hash (for easy lookup)
  var player = new Player(playerOptions);
  this.playersBySocket[player.socketId] = player;
  this.players[player.playerId] = player;
};

Game.prototype.startGame = function () {
  //TODO: if num players is less than num tiles emit FAAAAIL

  // assign (numTiles) # of drawers
  for (var i=0; i<this.nextAvailablePlayerId; i++) {  //reset everyone to guesser
    this.players[i].role = "guesser";
  }
  var drawerCount = 0;
  var newVictimId;
  while (drawerCount < this.numTiles) {
    newVictimId = Math.floor(Math.random()*this.nextAvailablePlayerId);
    if (this.players[newVictimId].role !== "drawer") {
      this.players[newVictimId].role = "drawer";
      this.players[newVictimId].panelId = drawerCount;
      drawerCount++;
    }
  }
  return this;
};

Game.prototype.checkGuess = function (player, guess) {
  if (guess === this.prompt) {
    return true;
    //DO SOMETHING TO GIVE PLAYER POINTS?
  }
  return false;
};

module.exports = Game;