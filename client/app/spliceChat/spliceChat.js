angular.module('spliced.spliceChat', [])
.controller('SpliceChatController', function ($scope, Socket) {

  $scope.msg = "";
  $scope.messages = [];
  $scope.imageURL = null;

  $scope.sendMsg = function () {
    Socket.emit('chatmsg', $scope.msg);
  };

  Socket.on('chatmsg', function (msg) {
    console.log("got message:", msg);
    $scope.messages.push(msg);
  });

  Socket.on('drawing', function (dataURL) {
    console.log("got drawing:", dataURL);
    $scope.imageURL = dataURL;
  });


});
