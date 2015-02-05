Can = {
  _doables: [],
  _run: function (user) {
    var self = this;
    self.inst = new instanceProto(user)
    Can._doables.forEach(function (canInstance) {
      canInstance.call(self.inst)
    })
  },
  do: function (func) {
    Can._doables.push(func)
  },
  _validate: function (action, subject) {
    var self = this;
    if (!self.inst.rules[subject]) {
      return false;
    }
    if (!self.inst.rules[subject][action]) {
     return false;
    }
    return self.inst.rules[subject][action]()
  },
  can: function (action, subject) {
    return this._validate(action, subject)
  },
  cannot: function (action, subject) {
    return !this._validate(action, subject)
  },
  authorize: function (action, subject) {
    if (this._validate(action, subject)) {
      return true;
    } else {
      throw new Meteor.Error("permission-denied", "Permission Denied");
    }
  },
  authorized: function (action, subject) {
    return this._validate(action, subject);
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