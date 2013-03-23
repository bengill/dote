var Game = {
    // create our properties
    display: null,
    map: {},
    engine: null,
    player: null,

    // initialize function
    init: function() {
        this.display = new ROT.Display(); // our visual map display
        document.body.appendChild(this.display.getContainer()); // add it to the end of our body tag

        this._generateMap(); // create our map

        this.engine = new ROT.Engine(); // create our asyncronous main loop
        this.engine.addActor(this.player); // an actor is anything with "getSpeed" or an "act" method
        this.engine.start(); //calls the main loop. when this call returns, the loop is locked
    },

    _generateMap: function() {
        var digger = new ROT.Map.Digger(); // new map type of digger
        var freeCells = []; // an array to hold cells of the map (where we walk)

        // this function is what gets called for each iteration of the digger create map function.
        // basically the create map function moves to the next thing (element in array) that is generated and
        // lets you point it at a method of your choice. we point .create() to the digCallback method.

        // value will either be a 1 or 0, if it's a 1 we just return, but if it's a 0, we progress
        var digCallback = function(x, y, value) {
            if (value) { return; }

            // create a 2D key (coords in a 2D array): 3, 4
            var key = x+","+y;
            // set that map key's value to a period
            // this map is the actual map object, the freeCells are just a way to remember what are map coords with a period are, more or less
            this.map[key] = "·";
            // add to the freeCells array
            freeCells.push(key);
        };
        digger.create(digCallback.bind(this)); // create the map, passing in our call back

        this._generateBoxes(freeCells); // draws the * on the map (replaces the period)
        this._drawWholeMap(); // now we finally draw the map
        this._createPlayer(freeCells); // add the player to the map
    },

    _createPlayer: function(freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length); // random 1 or 0 * freeCels.length
        var key = freeCells.splice(index, 1)[0]; // create a 2D coord
        var parts = key.split(","); // split the string by comma into an array
        var x = parseInt(parts[0], 10); // convert to a number
        var y = parseInt(parts[1], 10); // convert to a number
        this.player = new Player(x, y); // create a new player, passing in x and y
    },

    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length); // random 1 or 0 * freeCels.length
            var key = freeCells.splice(index, 1)[0]; // create a 2D key
            this.map[key] = "*"; // change random coords of freecelsl to *
        }
    },

    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(","); // the 2D coords were a string, so we split on the , to get both the x and y into an array
            var x = parseInt(parts[0], 10); // to make it a number, we use parseInt
            var y = parseInt(parts[1], 10); // same as above
            this.display.draw(x, y, this.map[key]); // draw the map value
        }
    }
};

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
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    var code = e.keyCode;
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
    window.removeListener("keydown", this);
    // unlock the engine
    Game.engine.unlock();
};

// extend player prototype with a draw function
Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
};

// initialize the game
Game.init();
