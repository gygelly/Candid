Can = {
  settings: {
    DbDeny: false, 
    whitelistClient: false,
    whitelistMethod: false,
    whitelistHTTP: false
  },
  do: function (rule) {
    addRule(rule.action, rule.subject, rule.condition, rule.user)
  },
  did: function () {},
  can: function (action, subject, conditions, user) {

    if (dbArray.indexOf(action) == -1) {
      throw new Error('Candid: Can.can invalid action "' + action + '"')
    }

    if (!_.isObject(subject)) {
      throw new Error('Candid: Can.can invalid subject, it must be a collection object')
    }

    if (Meteor.isClient) {
      user = user || Meteor.user()
    }

    if (!subject.getCollectionName) {
      throw new Error('Candid: Can.can invalid subject, are you sure that is from a collection?')
    }

    var subjectName = subject.getCollectionName()

    if (!Rules[action]) {
      return !Can.settings.whitelistDB
    }
    if (!Rules[action][subjectName]) {
      return !Can.settings.whitelistDB
    }
    return Can._run(action, subjectName, user, subject)
  },
  authorized: function (action, subject, conditions, user) {
    if (Meteor.isClient) {
      user = user || Meteor.user()
    }

    if (httpArray.indexOf(action) == -1 && action !== 'client' && action !== 'method') {
      throw new Error('Candid: Can.can invalid action "' + action + '"')
    }
    var cancel = false
    if (!Rules[action]) {
      cancel = true
    }
    if (!cancel && !Rules[action][subject]) {
      cancel = true
    }

    if (cancel) {
      if (action == 'client') {
        return !Can.settings.whitelistClient 
      }
      if (action === 'method') {
        return !Can.settings.whitelistMethod
      }
      if (httpArray.indexOf(action) != -1) {
        return !Can.settings.whitelistHTTP
      }
    }

    return Can._run(action, subject, user, conditions)
  },
  authorize: function () {
    if (Can.authorized.apply(this, arguments)) {
      return true
    } else {
      throw new Meteor.Error("permission-denied", "Permission Denied");
      return false
    }
  },
  _run: function (action, subject, user, conditionOverrides) {
    conditions = conditionOverrides || subject
    var passes = false
    Rules[action][subject].forEach(function (rule) {
      if (passes) {
        return true //only one success is required
      }
      if (_.isFunction(rule.condition) && !rule.condition(conditions)) {
        //nothing
      } else if (_.isFunction(rule.user)) {
        passes = rule.user(user, conditions)
      } else {
        passes = true
      }
    });
    return passes;
  }
}