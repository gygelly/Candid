if (Package['iron:router']) {
  Iron.Router.plugins.candidHook = function (router, options) {
    
    var clientOptions = {}
    if (!Can.settings.whitelistClient) {
      clientOptions['only'] = _.keys(Rules.client)
    }

    router.onBeforeAction(function () {
      if (Meteor.userId()) {
        Can.authorize('client', this.route.getName(), this.params, Meteor.user())
      } else {
        Can.authorize('client', this.route.getName(), this.params)
      }
      this.next()
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
        Can.authorize(req.method.toLocaleLowerCase(), this.route.getName(), this)
        next()
      }, serverOptions);
    }
  };
}