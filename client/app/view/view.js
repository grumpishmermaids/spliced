angular.module('spliced.view', [])

.controller('ViewController', function ($scope, Socket) {
  $scope.game = {
    code : null,
    name : null,
    nextAvailablePlayerId : null,
    numTiles : null,
    prompt : null,
    timeLimit : '',
    players : [],
    version : 0 // for undo...
  };

  // drawing info will go here.
  $scope.init = function() {
    Socket.emit('gameInit');
  };

  $scope.gameStart = function() {
    Socket.emit('gameStart');
  };

  // Saving image
  $scope.save = function() {
    var link = document.createElement('a');
    link.download = scope.game.prompt + ".png";
    link.href = scope.view.ctx.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
  };
  
  Socket.on('gameInfo', function(gameInfo){
    console.log(gameInfo);
    for(var key in gameInfo) {
      $scope.game[key] = gameInfo[key];
    }
  });

  Socket.on('playerJoined', function(playerData) {
    if($scope.game.players.indexOf(playerData) === -1){
      $scope.game.players.push(playerData);
    }
  });


  Socket.on('countdown', function(count) {
    console.log(count);
    $scope.game.timeLimit = count;
  });


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
      var y = tile.panelId % 2;
      var x = tile.panelId > 1 ? 1 : 0;
      var img = new Image();
      img.src = tile.dataURL;

      this.ctx.drawImage(img,
        (x*this.width_interval), //sets top left corner of image relative to canvas top left
        (y*this.height_interval), // samezies
        (this.width_interval), //width of image
        (this.height_interval)); //height of image
    };

    //initialize the view on the element when the players change...
    scope.$watch('game.numTiles', function(newVal) {
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