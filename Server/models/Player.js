var Player = function (playerOptions) {
  this.socketId = playerOptions.socketId;
  this.playerId = 0;
  this.playerName = playerOptions.playerName || "anonymous";
  this.panel = null;
  this.role = "guesser";
  this.score = 0;
};

Player.prototype.constructor = Player;

module.exports = Player;