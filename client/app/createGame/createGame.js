angular.module('spliced.ready', [])

.controller('CreateGameController', function ($scope, $route, Draw, Socket, $location, $cookies) {

  $scope.sendGameData = function(gameName, numOfDrawers) {
    //Socket.emit('createGame', {name:"booyah", numTiles:8, timeLimit: 30});
    Socket.emit("createGame", {name: gameName, numTiles: +numOfDrawers, timeLimit: 30});
    $location.path("/hostview");
  };

  //console.log("location.path: ", $location.path());
  if($location.path().indexOf("status") > -1){
    $scope.getGameStatus();
  }

});