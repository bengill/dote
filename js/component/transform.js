Component.TransformComponent = function(foo, params) {
    if (typeof params.position !== 'undefined') {
        this.x = params.position[0];
        this.y = params.position[1];
    }

    this.onCreate = function() {
        console.log('Coords => ' + this.x + "," + this.y);
    };
};
