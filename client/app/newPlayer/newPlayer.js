angular.module('spliced.newPlayer', [])

.controller('NewPlayerController', function ($scope, Draw, $location) {

  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  // which allows them to opt in to a drawing.
  $scope.enterCode = function(gameCode,playerName) {
    var newUrl = '/game/' + gameCode.toLowerCase();
    Draw.registerPlayer(gameCode.toLowerCase(), playerName);
    $location.path(newUrl);
  };

});