angular.module('spliced.newPlayer', [])

.controller('NewPlayerController', function ($scope, $location, Socket) {
  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  $scope.enterCode = function(gameCode,playerName) {
    Socket.emit('joinGame', {gameCode: gameCode.toLowerCase(), playerName: playerName});
  };

  Socket.on('joinSuccess', function() { $location.path('/playerwaitingscreen'); });
  Socket.on('joinFail', console.log("-------------------------------------------","Join Fail"));

});