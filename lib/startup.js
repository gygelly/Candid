addShadow({
  after: function (collection) {
    if (Package['insecure']) { return; };
    if (Can.settings.DbDeny) {
      collection.deny({
        insert: addDbRule('insert', collection._name),
        update: addDbRule('update', collection._name),
        remove: addDbRule('remove', collection._name),
        transform: function (doc) {
          return collection._transform(doc);
        }
      });
    } else {
      collection.allow({
        insert: addDbRule('insert', collection._name),
        update: addDbRule('update', collection._name),
        remove: addDbRule('remove', collection._name),
        transform: function (doc) {
          return collection._transform(doc);
        }
      });
    }
  }
})

var addDbRule = function (action, subject) {
  return function (userId, doc, fieldNames, modifier) {
    var user;
    if (userId) {
      user = Meteor.users.findOne(userId);
    };
    if (Can.settings.DbDeny) {
      var deny = !Can.can(action, doc, user, [fieldNames, modifier]);
      Can.did.call({
        action: action, 
        subject: subject, 
        conditions: doc, 
        user: user, 
        success: deny
      });
      return deny;
    } else {
      var allow = Can.can(action, doc, user, [fieldNames, modifier]);
        Can.did.call({
        action: action, 
        subject: subject, 
        conditions: doc, 
        user: user, 
        success: allow
      });
      return allow;
    };
  };
};