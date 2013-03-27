var Game = {
    // create our properties
    ananas: null,
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
        this.engine.addActor(this.pedro); // an actor is anything with "getSpeed" or an "act" method
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
            this.map[key] = ".";
            // add to the freeCells array
            freeCells.push(key);
        };
        digger.create(digCallback.bind(this)); // create the map, passing in our call back

        this._generateBoxes(freeCells); // draws the * on the map (replaces the period)
        this._drawWholeMap(); // now we finally draw the map
        this.player = this._createBeing(Player, freeCells);
        this.pedro = this._createBeing(Pedro, freeCells);
    },

    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length); // random 1 or 0 * freeCels.length
        var key = freeCells.splice(index, 1)[0]; // create a 2D coord
        var parts = key.split(","); // split the string by comma into an array
        var x = parseInt(parts[0], 10); // convert to a number
        var y = parseInt(parts[1], 10); // convert to a number
        return new  what(x, y); // create a new player, passing in x and y
    },

    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length); // random 1 or 0 * freeCels.length
            var key = freeCells.splice(index, 1)[0]; // create a 2D key
            this.map[key] = "*"; // change random coords of freecelsl to *
            if (!i) this.ananas = key; // first box now contains an ananas
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

// initialize the game
Game.init();
