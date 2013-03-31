Component.PerceptionComponent = function(foo, params) {
    this.distance = params.distance || null;
    this.angle = params.angle || null;

    this.onCreate = function() {
        console.log('Perception => distance: ' + this.distance + ", angle: " + this.angle);
    };
};
