angular.module('spliced', [
  'spliced.services',
  'spliced.draw',
  'spliced.ready',
  'spliced.view',
  'ngRoute',
  'pw.canvas-painter',
  'spliced.home',
  'ngCookies',
  'spliced.socket',
  'spliced.spliceChat'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/game', {
      redirectTo: '/'
    })
    .when('/game/view', {
      templateUrl: 'app/view/view.html',
      controller: 'ViewController'
    })
    .when('/game/:code', {
      templateUrl: 'app/ready/ready.html',
      controller: 'ReadyController'
    })
    .when('/game/:code/draw', {
      templateUrl: 'app/draw/draw.html',
      controller: 'DrawController'
    })
    .when('/game/:code/status', {
      templateUrl: 'app/ready/status.html',
      controller: 'ReadyController'
    })
    .when('/spliceChat', {
      templateUrl: 'app/spliceChat/spliceChat.html',
      controller: 'SpliceChatController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
