angular.module('spliced.socket', [])
.factory('Socket', function($rootScope) {
  var socket = io.connect();

  var on = function (event, cb) {
    socket.on(event, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        cb.apply(socket, args);
      });
    });
  };

  var emit = function (event, data, cb) {
    socket.emit(event, data, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        if (cb) {
          cb.apply(socket, args);
        }
      });
    });
  };

  return {
    on: on,
    emit: emit
  };
});