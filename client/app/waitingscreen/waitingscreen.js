angular.module('spliced.waitingScreen', [])

.controller('WaitingScreenController', function ($scope, $location, Socket) {
  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  Socket.on('gameStart', function (gameInfo) { 
    if (gameInfo.role === "drawer") { 
      $location.path('/drawer');
    } else {
      $location.path('/guesser');
    }
  });
});