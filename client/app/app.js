angular.module('spliced', [
  'spliced.services',
  'spliced.draw',
  'spliced.ready',
  'spliced.view',
  'ngRoute',
  'pw.canvas-painter',
  'spliced.home',
  'ngCookies',
  'spliced.spliceChat'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      redirectTo : '/home'
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/creategame', {
      templateUrl : 'app/createGame/createGame.html',
      controller  : 'CreateGameController' 
    })
    .when('/newplayer', {
      templateUrl : 'app/newPlayer/newPlayer.html',
      controller  : 'NewPlayerController'
    })
    .when('/waitingscreen', {
      templateUrl : 'app/waitingscreen/waitingscreen.html',
      controller  : 'WaitingScreenController'
    })
    .when('/hostview', {
      templateUrl: 'app/view/view.html',
      controller: 'ViewController'
    })
    .when('/drawer', {
      templateUrl: 'app/draw/draw.html',
      controller: 'DrawController'
    })
    .when('/guesser')
    .otherwise({
      redirectTo: '/home'
    });
});





    // .when('/game/:code/status', {
    //   templateUrl: 'app/ready/status.html',
    //   controller: 'ReadyController'
    // })
