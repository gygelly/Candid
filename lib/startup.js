Meteor.startup(function () {
  if (!_.isFunction(Can.did)) {
    throw new Error('Candid: Can.did needs to be a function!');
  };

  if (Can.settings.DbDeny) {
    var auth = 'deny';
  } else {
    var auth = 'allow';
  };

  _.keys(Rules.db).forEach(function (subject) {
    var ruleObj = {};
    ruleObj['insert'] = addDbRule('insert', subject);
    ruleObj['update'] = addDbRule('update', subject);
    ruleObj['remove'] = addDbRule('remove', subject);
    Mongo.Collection.get(subject)[auth](ruleObj);
  });
   

  _.keys(Rules.insert).forEach(function (subject) {
    Mongo.Collection.get(subject)[auth]({insert: addDbRule('insert', subject)});  
  });

  _.keys(Rules.update).forEach(function (subject) {
    Mongo.Collection.get(subject)[auth]({update: addDbRule('update', subject)});  
  });

  _.keys(Rules.remove).forEach(function (subject) {
    Mongo.Collection.get(subject)[auth]({remove: addDbRule('remove', subject)});  
  });
});

var addDbRule = function (action, subject) {
  return function (userId, doc) {
    var user;
    if (userId) {
      user = Meteor.users.findOne(userId);
    };
    if (Can.settings.DbDeny) {
      var deny = !Can.can(action, subject, doc, user);
      Can.did.call({
        action: action, 
        subject: subject, 
        condisions: doc, 
        user: user, 
        subject: deny
      });
      return deny;
    } else {
      var allow = Can.can(action, subject, doc, user);
        Can.did.call({
        action: action, 
        subject: subject, 
        condisions: doc, 
        user: user, 
        subject: allow
      });
      return allow;
    };
  };
};