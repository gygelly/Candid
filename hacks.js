// Carefully wrap Meteor.methods with CanDo. 
// This should not break methods or any other hacks.
Meteor.methods = _.wrap(Meteor.methods, function () {
  var func = Array.prototype.shift.apply(arguments)
  var methods = arguments[0]
  _.keys(methods).forEach(function (method) {
    methods[method] = _.wrap(methods[method], function () {
      var self = this;
      if (!self.connection) { 
        func = Array.prototype.shift.apply(arguments)
        return func.apply(self, arguments)
      } else {
        if (Meteor.users) {
          Can._run(Meteor.users.findOne(this.userId));
        } else {
          Can._run();
        }
        if (Can.authorize('method', method)) {
          func = Array.prototype.shift.apply(arguments)
          return func.apply(self, arguments)
        }
      }
    })
  });
  arguments[0] = methods //if MDG adds to methods keep all args
  func.apply(func, arguments)
})