angular.module('spliced.view', [])

.controller('ViewController', function ($scope, Socket) {
  // drawing info will go here.
  $scope.init = function() {
    Socket.emit('gameInit');
  };
  
  Socket.on('gameInfo', function(gameInfo){
    for(var key in gameInfo) {
      scope.game.key = gameInfo.key;
    }
    //not sure we need this, but will force an update of dom...
    // $scope.$digest();
  });

  Socket.on('newPlayer', function(playerData){
    players.push(playersData);
    //not sure we need this, but will force an update of dom...
    // $scope.$digest();
  });

  $scope.gameStart = function() {
    Socket.emit('gameStart');
  };

  $scope.game = {
    prompt : null,
    timer : null,
    numDrawers : 1,
    players : [],
    version : 0 // for undo...
  };

  //make scope accessable to window for debugging
  window.scope = $scope;

})
.directive('myView', ['Socket', function (Socket){
  //link function is invoked on intitialization by angular.
  var link = function(scope, element, attr) {
    var View = function(players, element) {
      this.players = players;
      //creates the canvas on which to display images
      this.ctx = element.children()[0].getContext('2d');
      this.ctx.canvas.width = element[0].clientWidth;
      this.ctx.canvas.height = element[0].clientHeight;

      this.setIntervals();

      if (this.players !== 1) {
        this.drawHalf(); 
      }

      this.drawSplits();
    };

    View.prototype.setIntervals = function() {
      //the intervals are what we use to draw borders and set image size and position
      if(this.players === 1){
        this.width_interval = this.ctx.canvas.width;
        this.height_interval = this.ctx.canvas.height;
      } else if (this.players > 1) {
        this.width_interval = (this.ctx.canvas.width/this.players)*2;
        this.height_interval = this.ctx.canvas.height/2;
      }


    };

    View.prototype.drawHalf = function() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.25;
      this.ctx.moveTo(0,this.ctx.canvas.height/2);
      this.ctx.lineTo(this.ctx.canvas.width,this.ctx.canvas.height/2); // Half separation
      this.ctx.stroke();
    };

    View.prototype.drawSplits = function() {
      var interval = Math.round(this.ctx.canvas.width/this.players)*2;
      for (var i = 0; i < (this.players / 2) - 1 ; i++) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.25;
        this.ctx.moveTo(interval*(i+1),0);
        this.ctx.lineTo(interval*(i+1),this.ctx.canvas.height);
        this.ctx.stroke();
      }
    };

    View.prototype.drawTile = function(tile) {
      var x = tile.panelID % 2;
      var y = tile.panelID > 1 ? 1 : 0;
      var img = new Image();
      img.src = tile.dataURL;

      this.ctx.drawImage(img,
        (x*this.width_interval), //sets top left corner of image relative to canvas top left
        (y*this.height_interval), // samezies
        (this.width_interval), //width of image
        (this.height_interval)); //height of image
    };

    //initialize the view on the element when the players change...
    scope.$watch('game.numDrawers', function(newVal) {
      scope.view = new View(newVal, element);
    });

    //listen for drawing events on socket to update the view object
    Socket.on('drawing', function (tile) {
      scope.view.drawTile(tile);
    });
  };

  return {
    link : link
  };

}]);