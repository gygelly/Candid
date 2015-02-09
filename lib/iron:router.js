if (Package['iron:router']) {
  Iron.Router.plugins.candidHook = function (router, options) {
    
    var clientOptions = {}
    if (!Can.settings.whitelistClient) {
      clientOptions['only'] = _.keys(Rules.client)
    }

    router.onBeforeAction(function () {
      var authorized = false;
      if (Meteor.userId()) {
        authorized = Can.authorized('client', this.route.getName(), this.params, Meteor.user())
      } else {
        authorized = Can.authorized('client', this.route.getName(), this.params)
      }
      if (authorized) {
        this.next()
      } else {
        throw new Meteor.Error("permission-denied", "Permission Denied");
      }
    }, clientOptions);

    if (Meteor.isServer) {
      var serverOptions = { where: 'server' }
      if (!Can.settings.whitelistHTTP) {
        serverOptions['only'] = _.union(
          _.keys(Rules['get']),
          _.keys(Rules['post']), 
          _.keys(Rules['put']),
          _.keys(Rules['delete']
        ))
      }

      router.onBeforeAction(function (req, res, next) {
        if (Can.authorized(req.method.toLocaleLowerCase(), this.route.getName(), this)) {
          next()
        } else {
          throw new Meteor.Error("permission-denied", "Permission Denied");
        }
      }, serverOptions);
    }
  };
}