var game = {};

game.position = function(x, y) {
    this._x = x;
    this._y = y;
};

game.rock = function() {
    game.position.apply(this);
};

// var foo = game.rock();
// var bar = new game.rock();

function loadData(json) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            var jsonText = xobj.responseText;
            window['archetypes'] = jsonText;
            console.log(jsonText);
        }
    }
    xobj.send(null);
}

loadData('json/archetypes.json');
loadData('json/levels.json');

