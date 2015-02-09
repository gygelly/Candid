Can = {
  _validate: function (action, subject, conditions) {
    var self = this;
    if (!Rules[subject]) {
      return 2; //not found
    }
    if (!Rules[subject][action]) {
     return 2; //not found
    }
    if (self._execute(Rules[subject][action], conditions)) {
      return 0 //true
    } else {
      return 1 //false
    }
  },
  _execute: function (rules, conditions) {
    rules.forEach(function (rule) {
      var match = true, allow = false;
      if (rule.conditions) { 
        if (!rule.conditions(conditions)) {
          match = false;
        }
      }
      if (match) {
        if (rule.user) {
          if (rule.user()) {
            allow = true
          }
        } else {
          allow = true
        }
      }
      //did
      return allow;
    });
  }
  can: function (action, subject) {
    var result = this._validate(action, subject)
    if (result == 0) {
      return true
    }
    if (result == 1) {
      return false
    }
    if (this.whitelistDB && result == 2) {
      return false
    } else {
      return true
    }
  },
  cannot: function (action, subject) {
    var result = this._validate(action, subject)
    if (result == 0) {
      return false
    }
    if (result == 1) {
      return true
    }
    if (this.whitelistDB && result == 2) {
      return true
    } else {
      return false
    }
  },
  authorize: function (action, subject) {
    var result = this._validate(action, subject)
    if (result == 0) {
      return true
    }
    if (result == 1) {
      throw new Meteor.Error("permission-denied", "Permission Denied");
      return false
    }
    if (result == 2 && action == 'method') {
      if (!this.whitelistMethod) { return true; }
      throw new Meteor.Error("permission-denied", "Permission Denied")
      return false
    }
    if (result == 2 && action == 'client') {
      if (!this.whitelistClient) { return true; }
      throw new Meteor.Error("permission-denied", "Permission Denied")
      return false
    }
    if (result == 2 && httpArray.indexOf(action) != -1 ) {
      if (!this.whitelistHTTP) { return true; }
      throw new Meteor.Error("permission-denied", "Permission Denied") 
      return false
    }
  },
  authorized: function (action, subject) {
    var result = this._validate(action, subject)
    if (result == 0) {
      return true
    }
    if (result == 1) {
      return false
    }
    if (result == 2 && action == 'method') {
      return !this.whitelistMethod;
    }
    if (result == 2 && action == 'client') {
      return !this.whitelistClient;
    }
    if (result == 2 && httpArray.indexOf(action) != -1 ) {
      return !this.whitelistHTTP;
    }
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