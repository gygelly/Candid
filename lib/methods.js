// Carefully wrap Meteor.methods with CanDo. 
// This should not break methods or any other hacks.
Meteor.methods = _.wrap(Meteor.methods, function () {
  var methodsFunc = Array.prototype.shift.apply(arguments)
  var methods = arguments[0]
  _.keys(methods).forEach(function (method) {
    methods[method] = _.wrap(methods[method], function () {
      var self = this;
      if (!self.connection && Meteor.isServer) { 
        func = Array.prototype.shift.apply(arguments)
        return func.apply(self, arguments)
      } else {
        if (Meteor.users && this.userId) {
          var user = Meteor.users.findOne(this.userId);
        } else {
          var user;
        }
        if (Can.authorized('method', method, arguments, user)) {
          Can.did.call({
            action:'method', 
            subject: method, 
            condisions: arguments, 
            user: user, 
            success: true
          })
          func = Array.prototype.shift.apply(arguments)
          return func.apply(self, arguments)
        } else {
          Can.did.call({
            action:'method', 
            subject: method, 
            condisions: arguments, 
            user: user, 
            success: false
          })
          throw new Meteor.Error("permission-denied", "Permission Denied");
        }
      }
    })
  });
  arguments[0] = methods //if MDG adds to methods keep all args
  methodsFunc.apply(func, arguments)
})