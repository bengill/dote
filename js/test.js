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

// MERGE
function merge(obj1,obj2){
    var attrname;
    var obj3 = {};
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

// CLONE
function clone(obj){
    if(obj === null || typeof(obj) != 'object')
        return obj;

    var temp = {};

    for(var key in obj)
        temp[key] = obj[key];
    return temp;
}

// LOAD
function loadData(json, where) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            var jsonText = xobj.responseText;
            window[where] = JSON.parse(jsonText);
            console.log(jsonText);
        }
    };
    xobj.send(null);
}

function init() {
    for (var i=0;i<window.levels.objects.length;i++) {
        var test = GameObject.factory(window.levels.objects[i]);
    }
}

loadData('json/archetypes.json', 'archetypes');
loadData('json/level_1.json', 'levels');

init();
