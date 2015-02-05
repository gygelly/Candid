Can = {
  _doables: [],
  _run: function (user) {
    var self = this;
    self.inst = new instanceProto(user)
    Can._doables.forEach(function (canInstance) {
      canInstance.call(self.inst)
    })
  },
  define: function (func) {
    Can._doables.push(func)
  },
  _validate: function (action, subject) {
    var self = this;
    if (!self.inst.rules[subject]) {
      return 2; //not found
    }
    if (!self.inst.rules[subject][action]) {
     return 2; //not found
    }
    if (self.inst.rules[subject][action]()) {
      return 0 //true
    } else {
      return 1 //false
    }
  },
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
  },
  settings: {
    whitelistDB: false,
    whitelistClient: false,
    whitelistMethod: false,
    whitelistHTTP: false
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

var httpArray = [
  'http',
  'get',
  'post',
  'put',
  'delete'
]

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