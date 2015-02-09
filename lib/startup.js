Meteor.startup(function () {
  if (!_.isFunction(Can.did)) {
    throw new Error('Candid: Can.did needs to be a function!')
  }

  if (Can.settings.DbDeny) {
    var auth = 'deny'
  } else {
    var auth = 'else'
  }

  if (Rules.db) {
    Rules.db.forEach(function (subject) {
      var ruleObj = {}
      ruleObj['insert'] = addDbRule('insert', subject)
      ruleObj['update'] = addDbRule('update', subject)
      ruleObj['remove'] = addDbRule('remove', subject)
      Mongo.Collection.get(subject)[auth](ruleObj);
    });
      
  }

  if (Rules.insert) {
    Rules.insert.forEach(function (subject) {
      Mongo.Collection.get(subject)[auth]({insert: addDbRule('insert', subject)});  
    });
  }

  if (Rules.update) {
    Rules.update.forEach(function (subject) {
      Mongo.Collection.get(subject)[auth]({update: addDbRule('update', subject)});  
    });
  }

  if (Rules.remove) {
    Rules.remove.forEach(function (subject) {
      Mongo.Collection.get(subject)[auth]({remove: addDbRule('remove', subject)});  
    });
  }
});

var addDbRule = function (action, subject, invert) {
  return function (userId, doc) {
    var user;
    if (userId) {
      user = Meteor.users.findOne(userId);
    }
    if (Can.settings.DbDeny) {
      return !Can.can(action, subject, doc, user)
    } else {
      return Can.can(action, subject, doc, user)
    }
  }
}