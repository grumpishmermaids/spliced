angular.module('spliced.home', [])

.controller('HomeController', function ($scope, Draw, $location, Socket) {

  $scope.createGame = function () {
    Socket.emit('createGame', {name:"booyah", numTiles:8, timeLimit: 30});
    Draw.createGame(function (code) {
      $location.path('/game/' + code);  // redirect to 
    });
  };

  $scope.enterCode = function (gameCode) {
    Socket.emit('joinGame', {gameCode:gameCode, playerOptions:{playerName:"bob"}});
    var newUrl = '/game/' + gameCode.toLowerCase();
    $location.path(newUrl);
  };

});