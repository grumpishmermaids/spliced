angular.module('spliced.view', [])

.controller('ViewController', function ($scope) {
  // drawing info will go here.

  $scope.game = {};
  $scope.game.prompt = "Horse";
  $scope.game.timer = "00:10";
  $scope.game.numPlayers = 4;
  $scope.game.tiles = [[],[]];
  $scope.game.drawing = undefined;
  $scope.game.version = 0;

})
.directive('myView', ['Socket', function (Socket){

  //link function is invoked on intitialization by angular.
  var link = function(scope, element, attr) {

    var View = function(players, element) {
      this.ctx = element.children()[0].getContext('2d');
      console.log(this.ctx);
      this.players = players;
      this.ctx.canvas.width = element[0].clientWidth;
      this.ctx.canvas.height = element[0].clientHeight;

      this.width_interval = (this.ctx.canvas.width/this.players)*2;
      this.height_interval = this.ctx.canvas.height/2;

      this.drawBorder();
      if (this.players !== 1) {
        this.drawHalf();
      }

      this.drawSplits();
    };

    // View.prototype.clearCanvas = function() {
    //   this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    // };

    View.prototype.drawBorder = function() {
      this.ctx.rect(20,20,this.ctx.canvas.width-40,this.ctx.canvas.height-40);
      this.ctx.fillStyle = "white";
      this.ctx.fill();
    };

    View.prototype.drawHalf = function() {
      this.ctx.beginPath();
      this.ctx.moveTo(0,this.ctx.canvas.height/2);
      this.ctx.lineTo(this.ctx.canvas.width,this.ctx.canvas.height/2); // Half separation
      this.ctx.stroke();
    };

    View.prototype.drawSplits = function() {
      var interval = Math.round(this.ctx.canvas.width/this.players)*2;
      for (var i = 0; i < this.players; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(interval*(i+1),0);
        this.ctx.lineTo(interval*(i+1),this.ctx.canvas.height);
        this.ctx.stroke();
      }
    };

    View.prototype.drawTile = function(x,y) {
      var img = new Image();
      img.src = scope.game.tiles[x][y];
      
      this.ctx.drawImage(img,
        (x*this.width_interval), //sets top left corner of image relative to canvas top left
        (y*this.height_interval), // samezies
        (this.width_interval), //width of image
        (this.height_interval)); //height of image
    };

    var view = new View(scope.game.numPlayers, element);

    Socket.on('drawing', function (tile) {
      console.log("got data", tile);
      scope.game.tiles[tile.x][tile.y] = tile.dataURL;
      view.drawTile(tile.x, tile.y);
    });
  };

  return {link : link};

}]);



          // ((((x*this.width_interval)%(this.players/2)))*this.width_interval),
          // (i*2 < this.players ? 0 : this.ctx.canvas.height/2), 
          // this.width_interval, this.height_interval);