if (Package['iron:router']) {
  Iron.Router.plugins.candidHook = function (router, options) {
    if (Meteor.isClient) {
      var clientOptions = { where: 'client'}
      if (!Can.settings.whitelistClient) {
        clientOptions['only'] = _.keys(Rules.client)
      }

      router.onBeforeAction(function () {
        var authorized = false, route = this.route.getName() || 'root';
        if (Meteor.userId()) {
          authorized = Can.authorized('client', route, this.params, Meteor.user())
        } else {
          authorized = Can.authorized('client', route, this.params)
        }
        if (authorized) {
          Can.did.call({
            action:'client', 
            subject: route, 
            conditions: this.params, 
            user: Meteor.user(), 
            success: true
          })
          this.next()
        } else {
          Can.did.call({
            action:'client', 
            subject: route, 
            conditions: this.params, 
            user: Meteor.user(), 
            success: false
          })
          if (options.permissionDeniedTemplate) {
            this.render(options.permissionDeniedTemplate)
          } else {
            throw new Meteor.Error("permission-denied", "Permission Denied");
          }
        }
      }, clientOptions);
    }
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
        var route = this.route.getName() || 'root';
        if (Can.authorized(req.method.toLocaleLowerCase(), route, req)) {
          Can.did.call({
            action: req.method.toLocaleLowerCase(), 
            subject: route, 
            conditions: req, 
            user: null, 
            success: true
          })
          next()
        } else {
          Can.did.call({
            action: req.method.toLocaleLowerCase(), 
            subject: route, 
            conditions: req, 
            user: null, 
            success: false
          })
          throw new Meteor.Error("permission-denied", "Permission Denied");
        }
      }, serverOptions);
    }
  };
}