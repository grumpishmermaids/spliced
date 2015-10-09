angular.module('spliced', [
  'spliced.services',
  'spliced.home',
  'spliced.draw',
  'spliced.ready',
  'spliced.newPlayer',
  'spliced.view',
  'spliced.guesser',
  'spliced.waitingScreen',
  'ngRoute',
  'ngCookies',
  'pw.canvas-painter'
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
    .when('/guesser', {
      templateUrl: 'app/guesser/guesser.html',
      controller: 'GuesserController'
    })
    .otherwise({
      redirectTo: '/home'
    });
});





    // .when('/game/:code/status', {
    //   templateUrl: 'app/ready/status.html',
    //   controller: 'ReadyController'
    // })
