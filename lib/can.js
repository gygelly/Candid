Can = {
  settings: {
    DbDeny: false, 
    whitelistDB: true,
    whitelistClient: false,
    whitelistMethod: false,
    whitelistHTTP: false
  },
  do: function (rule) {
    addRule(rule.action, rule.subject, rule.condition, rule.user)
  },
  can: function (action, subject, user, condition) {

    if (!_.contains(dbArray, action)) {
      throw new Error('Candid: Can.can invalid action "' + action + '"')
    }

    if (!_.isObject(subject)) {
      throw new Error('Candid: Can.can invalid subject, it must be a collection object')
    }

    var subjectName;
    if (subject._getCollectionName) {
      subjectName = subject._getCollectionName()
    } else if (subject._name) {
      subjectName = subject._name
    }

    if (!subjectName) {
      throw new Error('Candid: Can.can invalid subject, are you sure that is from a collection?')
    }

    if (Meteor.isClient) {
      user = user || Meteor.user()
    }
    var condition = condition || [];
    condition.unshift(subject);
    return Can._run(action, subjectName, user, condition);
  },
  authorized: function (action, subject, conditions, user) {
    if (Meteor.isClient) {
      user = user || Meteor.user()
    }

    if (!_.contains(httpArray, action) && action !== 'client' && action !== 'method') {
      throw new Error('Candid: Can.can invalid action "' + action + '"')
    }

    return Can._run(action, subject, user, conditions)
  },
  _run: function (action, subject, user, conditions) {

    if (!Rules[action][subject] && action !== 'db' && action !== 'html') {
      if (_.contains(dbArray, action)) {
        return !Can.settings.whitelistDB
      }

      if (action == 'client') {
        return !Can.settings.whitelistClient 
      }
      if (action === 'method') {
        return !Can.settings.whitelistMethod
      }
      if (_.contains(httpArray, action)) {
        return !Can.settings.whitelistHTTP
      }
    }

    var passes = false;

    if (action === 'db') {
      passes = _.some(dbArray.slice(1), function (action) {
        return Can._run(action, subject, user, conditions);
      });
    } else if (action === 'html') {
      passes = _.some(httpArray.slice(1), function (action) {
        return Can._run(action, subject, user, conditions);
      });
    } else {
      passes = _.some(Rules[action][subject], function (rule) {
        return (_.isFunction(rule.condition) ? rule.condition.apply(rule.condition, conditions) : true ) && 
          (_.isFunction(rule.user) ? rule.user.apply(rule.user, _.union(user, conditions)) : true );
      });
    }

    return passes;
  },
  did: function () {},
  _destroyAllRules: function () {
    //allow rules will still exist!
    var empties = []
    actionsArray.forEach(function (action) {
      empties.push({})
    });

    Rules = _.object(actionsArray, empties); 
  }
}
