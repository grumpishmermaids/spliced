var Player = function (playerOptions) {
  this.socketId = playerOptions.socketId;
  this.playerId = playerOptions.playerId;
  this.playerName = playerOptions.playerName || "anonymous";
  this.panelId = null;
  this.role = "guesser";
  this.score = 0;
};

Player.prototype.constructor = Player;

module.exports = Player;