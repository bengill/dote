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

function loadDatos() {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/archetypes.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            var jsonTexto = xobj.responseText;
            window['archetypes'] = jsonTexto;
            console.log(jsonTexto);
        }
    }
    xobj.send(null);
}

loadDatos();

