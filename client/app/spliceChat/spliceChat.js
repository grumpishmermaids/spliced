angular.module('spliced.spliceChat', [])
.controller('SpliceChatController', function ($scope, Socket) {

  $scope.msg = "";
  $scope.messages = [];
  $scope.panels = [0, 1, 2, 3];
  // $scope.imageURL = null;

  $scope.sendMsg = function () {
    Socket.emit('chatmsg', $scope.msg);
  };

  Socket.on('chatmsg', function (msg) {
    console.log("got message:", msg);
    $scope.messages.push(msg);
  });

  Socket.on('drawing', function (data) {
    console.log("got drawing:", data);
    // $scope.imageURL = dataURL;
    $scope.panels[data.tileID] = data.imageURL;
  });


});
