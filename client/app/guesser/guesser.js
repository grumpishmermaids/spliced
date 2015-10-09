angular.module('spliced.guesser', [])

.controller('GuesserController', function ($scope, $location, Socket) {

  $scope.sendGuess = function(guess) {
    // Send guess
    Socket.emit("guess", guess);
  };

  // Receive response
  Socket.on("bingo", function(data) {
    console.log("Bingo, motherfuckers!");
  });

  Socket.on("antibingo", function(data) {
    $scope.guess = null;
    console.log("Wrong, jackass!");
  });

  Socket.on('end', function () {
    $location.path('/endGame');
  });

});