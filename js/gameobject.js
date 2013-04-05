function GameObject(descriptor) {
  this.components = [];
}

GameObject.prototype.event = function(name, params){
  // "guess" name of the event handler
  var handler_name = 'on' + name.charAt(0).toUpperCase() + name.slice(1);

  // invoke event handler in each component if it exists
  for (var i = 0, e = this.components.length; i != e; ++i) {
    var component = this.components[i];
    if (handler_name in component && typeof component[handler_name] == 'function') {
      component[handler_name].call(component, params);
    }
  }
};

GameObject.factory = function(descriptor){
  var name;

  // get the archetype descriptor
  var components = clone(window.archetypes[descriptor.archetype]);

  // merge the descriptor with the archetype
  for (name in components) {
    // only merge component descriptors
    if (typeof descriptor[name] == 'object') {
      components[name] = merge(components[name], descriptor[name]);
    }
  }

  // create the object
  var obj = new GameObject();

  // actually create the components
  for (name in components) {
    if (typeof components[name] !== 'object') continue;

    // "guess" the name of the component constructor
    var type_name = name.charAt(0).toUpperCase() + name.slice(1) + 'Component';

    // construct the component
    var component = new Component[type_name](this, components[name]);

    // register the component by name and in our ordered list
    obj[name] = component;
    obj.components.push(component);
  }

  // add the name
  obj.archetype = descriptor.archetype;

  // send a "create" event to all our components
  // signaling that the whole object is created
  obj.event('create', {});
};
