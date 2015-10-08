var Player = function (gameCode, playerId, options) {
  this.playerId = playerId;
  this.playerName = options.playerName || "anonymous";
  this.artistPanel = null;
  this.score = 0;
};

Player.prototype.constructor = Player;

module.exports = Player;