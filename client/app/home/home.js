angular.module('spliced.home', [])

.controller('HomeController', function ($scope, Draw, $location, Socket) {

  $scope.createGame = function () {
    $location.path("/creategame");
  };


  $scope.enterCode = function (gameCode) {
    Socket.emit('joinGame', {gameCode:gameCode, playerOptions:{playerName:"bob"}});
    var newUrl = '/game/' + gameCode.toLowerCase();
    $location.path(newUrl);
  };

  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  // which allows them to opt in to a drawing.
  $scope.newPlayer = function() {
    $location.path('/newPlayer');
  };

});