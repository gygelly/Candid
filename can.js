Can = {
  _can: [],
  _run: function (user) {
    var self = this;
    self.inst = new instanceProto(user)
    Can._can.forEach(function (canInstance) {
      canInstance.call(self.inst)
    })
  },
  can: function (action, subject, shout) {
    var self = this;
    if (!self.inst.rules[subject]) {
      return false;
    }
    if (!self.inst.rules[subject][action]) {
     return false;
    }
    return self.inst.rules[subject][action]()
  },
  cannot: function (action, subject, shout) {
    return !this.can(action, subject, shout)
  },
  do: function (func) {
    Can._can.push(func)
  }
}

var instanceProto = function (user) {
  var self = this;
  self.user = user
  self.rules = {}
  self.do = function (action, subject, conditions) {
    Rule.new(self.rules, true, action, subject, conditions)
  }
  self.dont = function (action, subject, conditions) {
    Rule.new(self.rules, false, action, subject, conditions)
  }
  return self;
}

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tracker.autorun(function () {
      if (Meteor.user) { //quack?
        Can._run(Meteor.user()); //duck!
      } else {
        Can._run(); //goose...
      }
    });
  });
}