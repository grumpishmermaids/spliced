angular.module('spliced.waitingScreen', [])

.controller('WaitingScreenController', function ($scope, $location, Socket) {
  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  Socket.on('gameStart', function(role) { 
    $location.path('/drawer');
    // if(role === "drawing") { 
       
    // } else $location.path('/guessing');
  });
});