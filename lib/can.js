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

    if (dbArray.indexOf(action) == -1) {
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

    if (httpArray.indexOf(action) == -1 && action !== 'client' && action !== 'method') {
      throw new Error('Candid: Can.can invalid action "' + action + '"')
    }

    return Can._run(action, subject, user, conditions)
  },
  _run: function (action, subject, user, conditions) {

    if (!Rules[action][subject] && action !== 'db' && action !== 'html') {
      if (dbArray.indexOf(action) != -1) {
        return !Can.settings.whitelistDB
      }

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

    var passes = false
    if (action === 'db') {
      passes = Can._run('insert', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('read', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('update', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('remove', subject, user, conditions)
    } else if (action === 'html') {
      passes = Can._run('get', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('post', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('put', subject, user, conditions)
      if (passes) { return passes }
      passes = Can._run('delete', subject, user, conditions)
    } else {
      Rules[action][subject].forEach(function (rule) {
        if (passes) {
          return true //only one success is required
        }
        if (_.isFunction(rule.condition) && !rule.condition.apply(rule.condition, conditions)) {
          //nothing
        } else if (_.isFunction(rule.user)) {
          if (rule.user.apply(rule.user, _.union([user].concat(conditions)))) {
            passes = true;
          }
        } else {
          passes = true;
        }
      });
    }
    return passes;
  },
  did: function () {},
  _distroyAllRules: function () {
    //allow rules will still exist!
    var empties = []
    actionsArray.forEach(function (action) {
      empties.push({})
    });

    Rules = _.object(actionsArray, empties); 
  }
}
