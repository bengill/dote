// our player class
var Player = function(x, y) {
    this._x = x; // x coord
    this._y = y; // y coord
    this._draw(); // draw (an extended method that we added below)
};

// get our players speed
Player.prototype.getSpeed = function() {
    return 100; // set it to 100
};

// get our players
Player.prototype.act = function() {
    Game.engine.lock(); // interrupts the engine by an asynchronous action
    window.addEventListener("keydown", this); // listens for a keypress
};

// bind some keys
Player.prototype.handleEvent = function(e) {
    var code = e.keyCode;
    console.log(code);
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }
    var keyMap = {};
    // keyMap[38] = 0;
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }

    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; } // return if the newKey isn't available in the map

    // draw players location
    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    // update player's x and y
    this._x = newX;
    this._y = newY;
    // redraw player
    this._draw();
    // remove listener
    window.removeEventListener("keydown", this);
    // unlock the engine
    Game.engine.unlock();
};

// check inside of boxes
Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (Game.map[key] !== "*") {
        alert("There is no box here.");
    } else if (key === Game.ananas) {
        alert ("Hooray! You found an ananas and won this game!");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        alert("This box is empty.");
    }
};

// extend player prototype with a draw function
Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
};

Player.prototype.getX = function() { return this._x; };

Player.prototype.getY = function() { return this._y; };

var Pedro = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
};

Pedro.prototype.getSpeed = function() { return 100; };

Pedro.prototype.act = function() {
    var x = Game.player.getX();
    var y = Game.player.getY();
    var path = [];

    var passableCallback = function(x, y) {
        return (x+","+y in Game.map);
    };

    var pathCallback = function(x, y) {
        path.push([x, y]);
    };

    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
    astar.compute(this._x, this._y, pathCallback);

    path.shift(); /* remove Pedro's position */
    if (path.length == 1) {
        Game.engine.lock();
        alert("Game over - you were captured by Pedro!");
    } else {
        x = path[0][0];
        y = path[0][1];
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
};

Pedro.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "P", "red");
};
