Game.Map = function(map) {
    this._map = map;
};

Game.Map.prototype._generate = function() {
    var digger = new ROT.Map.Digger();
    var freeCells = [];

    var digCallback = function(x, y, value) {
        if (value) { return; }
        var key = x+","+y;
        this._map[key] = ".";
        freeCells.push(key);
    };

    digger.create(digCallback.bind(this));
    this._generateBoxes();
};

Game.Map.prototype._generateBoxes = function(freeCells) {
    for (var i=0;i<10;i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this._map[key] = "*";
        if (!i) this.ananas = key;
    }
};

Game.Map.prototype._drawWholeMap = function() {
    for (var key in this._map) {
        var parts = key.split(","); // the 2D coords were a string, so we split on the , to get both the x and y into an array
        var x = parseInt(parts[0], 10); // to make it a number, we use parseInt
        var y = parseInt(parts[1], 10); // same as above
        this.display.draw(x, y, this._map[key]); // draw the map value
    }
};





