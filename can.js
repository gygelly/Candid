Can = {
  _can: [],
  _run: function (user) {
    Rule.rules = {};
    var inst = new instanceProto(user)
    Can._can.forEach(function (canInstance) {
      canInstance.call(inst)
    })
  },
  can: function (action, subject, shout) {
    if (!Rule.rules[subject]) {
      return false;
    }
    if (!Rule.rules[subject][action]) {
     return false;
    }
    return Rule.rules[subject][action]()
  },
  cannot: function (action, subject, shout) {
    if (!Rule.rules[subject]) {
      return true;
    }
    if (!Rule.rules[subject][action]) {
     return true;
    }
    return !Rule.rules[subject][action]()
  },
  do: function (func) {
    Can._can.push(func)
  }
}

var instanceProto = function (user) {
  var self = this;
  self.user = user
  self.rules = {}
  self.can = function (action, subject, conditions) {
    Rule.new(self.rules, true, action, subject, conditions)
  }
  self.cannot = function (action, subject, conditions) {
    Rule.new(self.rules, false, action, subject, conditions)
  }
  console.log(self)
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