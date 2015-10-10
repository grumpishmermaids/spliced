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

  $scope.computeRGB = function(current, max, min) {
    current = Number(current);
    min = min || 0;
    current -= min;
    max -= min;

    var percent = Math.round((current/max)*100);
    if (percent < 0) {
      percent = 0;
    }

    var red = Math.round(percent*255)/100;
    var green = 255 - red;
    var percent;

    return {color: "rgb(" + Math.round(red) + ", " + Math.round(green) + ", 0)"};
  };
  
  Socket.on('gameInfo', function(gameInfo){
    console.log(gameInfo);
    for(var key in gameInfo) {
      $scope.game[key] = gameInfo[key];
    }
  });

  Socket.on('end', function(data) {
    console.log('END!');
    $scope.game.timeLimit = "Game Over";
  });

  Socket.on('playerJoined', function(playerData) {
    console.log('playerJoined');

    // var dups =_.filter($scope.game.players, function(obj){
    //   return obj.playerName === playerData.playerName;
    // })

    // if(dups.length === 0){
    //   $scope.game.players.push(playerData);
    // }

    $scope.game.players = playerData;
  });

  Socket.on('guess', function(guess) {
    console.log(guess);
    _.each($scope.game.players, function(player) {
      if (guess.player.playerName === player.playerName) {
        if (guess.bingo) {
          player.lastGuess = "winner";
          player.role = "winner";
          player.score = guess.player.score;
          player.guessStyle = $scope.computeRGB(0, 20, 0);
        } else {
          player.lastGuess = guess.guess;
          player.guessStyle = $scope.computeRGB(guess.levScore, 20, 0);
        }
      }
    });
  });

  Socket.on('gameStart', function(gameData) {
    $scope.game.players = gameData.players;
    // _.each(gameData.players, function(player) {
    //   _.extend($scope.game.players[player.username], player);
    // });
  });

  Socket.on('countdown', function(count) {
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