angular.module('spliced.waitingScreen', [])

.controller('WaitingScreenController', function ($scope, $location, Socket) {
  
  // setTimeout(function() {
    Socket.emit('waiting');
  // }, 1000);

  Socket.on('elevatorMusic', function (info) {
    $scope.playerName = info.player.playerName;
    $scope.score = info.player.score;
    $scope.gameCode = info.game.code;
    $scope.gameName = info.game.name;
  });


  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  Socket.on('gameStart', function (gameInfo) { 
    if (gameInfo.role === "drawer") { 
      $location.path('/drawer');
    } else {
      $location.path('/guesser');
    }
  });
});