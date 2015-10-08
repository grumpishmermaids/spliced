var gameLogic = require('../game/gameLogic.js');
var getRandomPrompt = require('../game/prompts.js');

var Game = function (gameCode, options) {
  this.code = gameCode;
  this.prompt = getRandomPrompt();
  this.name = options.name || "AWESOME SPLICED GAME";
  this.numTiles = options.numTiles || 4;
  this.timeLimit = options.timeLimit || null;
  this.maxPlayers = options.maxPlayers || null;
  this.players = [];
};

Game.prototype.constructor = Game;

Game.prototype.addPlayer = function (player) {
  this.players.push(player);
};

Game.prototype.checkGuess = function (player, guess) {
  if (guess === prompt) {
    return true;
    //DO SOMETHING TO GIVE PLAYER POINTS?
  }
  return false;
};

module.exports = Game;