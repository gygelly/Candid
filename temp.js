//temp until resolved: https://github.com/rclai/meteor-document-methods/pull/4

if (typeof Object.create !== 'function') {
  Object.create = (function () {
    var Temp = function () {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw TypeError('Argument must be an object');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}

//global tool
idempotentTransform = function (helperFunction) {
  var constructor = Mongo.Collection;

  Mongo.Collection = function() {
    var ret = constructor.apply(this, arguments);
    if ((!_.isFunction(this._transform) || this._hasCollectionHelpers) && _.isFunction(this.helpers)) {
      helperFunction(this)
    }
    return ret;
  };

  Mongo.Collection.prototype = Object.create(constructor.prototype);
  Mongo.Collection.prototype.constructor = Mongo.Collection;

  _.extend(Mongo.Collection, constructor);

  // Meteor.Collection will lack ownProperties that are added back to Mongo.Collection
  Meteor.Collection = Mongo.Collection;
};