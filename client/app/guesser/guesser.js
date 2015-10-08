angular.module('spliced.guesser', [])

.controller('GuesserController', function ($scope, Socket) {

  $scope.sendGuess = function(guess) {
    // Send guess
    Socket.emit("guess", guess);

    // Receive response
    Socket.on("bingo", function(data) {
      console.log("You win!");
    });

    Socket.on("antibingo", function(data) {
      $scope.guess = null;
      console.log("Wrong guess!");
    });
  };
});