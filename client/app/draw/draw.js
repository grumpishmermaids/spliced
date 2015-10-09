angular.module('spliced.draw', [])

.controller('DrawController', function ($scope, $route, Draw, $q, $location, $cookies, Socket, $timeout) {
  // drawing info will go here.
  $scope.data = {};
  $scope.data.drawing = {};
  $scope.prompt = "";

  Socket.emit('tellMeASecret', "iAmStupid");
  Socket.on('barryNeverTells', function (prompt) {
    $scope.prompt = prompt;
  });

  //for the undo button (pw-canvas thing)
  $scope.data.drawing.version = 0;

  //scope options...
  $scope.canvas = {
    undo: true, 
    width: 440, 
    height: 440, 
    color: 'black', 
    lineWidth: 4,
    imageSrc: undefined,
    pallette: ['#ee4035', ' #f37736', '#fdf498', '#7bc043','#0392cf','#909090','#000000','#ffffff']
  };

  $scope.undo = function() { 
    $scope.data.drawing.version--;
  };

  // This grabs the game code, generated at the home screen, and passes it into our save function.
  $scope.data.gameCode = $route.current.params.code;

  // On the server side, we sent a randomly generated template ID to the user in a cookie.
  var templateId = $cookies.get('templateId');
  $scope.data.userId = $cookies.get($scope.data.gameCode + '_playerName');
  console.log($scope.data.userId);

  //sends the static drawing to the server
  $scope.sendDrawing = function () {
    var dataURL = document.getElementById("pwCanvasMain").toDataURL();
    Socket.emit('drawing', {
      // "x": $scope.data.userId % 2,
      // "y": $scope.data.userId > 1 ? 1 : 0,
      "dataURL": dataURL
    });
  };

  //sends the temp drawing to the server (enables live streaming);
  $scope.sendTmpDrawing = function () {
    var dataURL = document.getElementById("pwCanvasTmp").toDataURL();
    console.log(1);
    console.log('called');
    Socket.emit('drawing', {
      // "x": $scope.data.userId % 2,
      // "y": $scope.data.userId > 1 ? 1 : 0,
      "dataURL": dataURL
    });
  };

  Socket.on('end', function () {
    $location.path('/endGame');
  });
});






























