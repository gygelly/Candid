Candid
===============


This is a Candid user permissions layer for Meteor JS, inspired by Rails CanCan but adapted to Meteor! 
Candid lets you define permission rules for your database, methods, and routes.
Candid rules are declarative, programmatic, and assertive, or you know... candid. 

What you get for free:

* Automatically generate allow/deny for collections 
* js and html helpers
* Methods (via `_.wrap`, dependent on `this.connection`, server calls will not fire authorize)
* (iron) Routing control
* user access logging (implement your own solution)

## API

### Can.do (Create your rules) 

You can create Candid rules anywhere but I would recommend placing them all in `/lib/candid.js`.

Can.do accepts an object for a rule definition. 

* Your action defines what the user can do, like a database update. 
* Your subject will ether be a string, like a method name, or a Mongo.Collection
(Subjects must match their actions).
* You can define a condition to limit your rule, like does `post.group === 'awesome'`?
* Finally you can define the user function to check user permissions, 
[alanning:roles](https://atmospherejs.com/alanning/roles) could be useful here.  

```js
Can.do({
  action: String,
  subject: String || Mongo.Collection instance 
  condition: function (doc) {
    //optional, runs before user
    //if defined must return true to continue
  },
  user: function (user, doc) {
    //optional, if you have authentication or roles
    //if defined must return true to allow action
    //if no user is logged in, user will be undefined
  }
})
```
###### NOTE: Do not define user if its not needed. If the user function is detected Candid will try to get the current user, which may trigger database operations.

#### Possible Actions

The following are all the actions currently available in Candid. You must keep them all lowercase (js does not have proper symbols).

* Database (can)
  * db (will create the rule for all DB ops) 
  * insert
  * read
  * update
  * remove

* Routing (authorized)
  * method
  * client
  * http (will create the rules for all REST ops)
  * get
  * post
  * put
  * delete


### Database in more detail
For these your subject must be a Mongo.Collection with a unique mongo collection name.

The condition will return the current document.

The user will return the current user and the current document.

### Methods in more detail  
The subject must be a string representing the method name. 

The condition will be the arguments given to the method.

The user will return the current user and the current document.

### Routing in more detail  
For configuration see [#routes](#routes)

###### NOTE: This depends on iron:router. Server routes currently only refers to ones defined via iron:router. 

The subject must be a string representing the route name (`url =/foo/bar` -> `name = foo.bar`).

For the client the condition and user functions doc will be the this.params from iron:router. 
For the server it will be the this.request.

For client the user will return the current user.

For server the user will never return a user:
No http actions will have the user object available to them and these rules will be all or nothing. 
If you have a security solution to this let me know via a Github issue! 
Please do not PR these solutions as I will require them to be add-ons. (Unless your MDG -_^)

### Can.can and Can.authorized (helpers)

```js
/*** insert, read, update, remove ***/
var subject = Example.findOne()
Can.can( 'action', subject )
//active authentication, returns boolean

/*** client, method, rest, get, post, put, delete ***/
Can.authorized( 'action', 'subject' ) 
//routing/method authentication, returns boolean
```

```html

{{#if can 'action' target}}
  ...
{{/if}}

{{#if authorized 'action' target}}
  ...
{{/if}}

```

### Can.did (Full access logging)

You should have known this was coming...

Can.did runs after every action. You can use it to log actions as you see fit, just overload the noop with your own function.

```js
Can.did = function () {
  this.action //the action attempted 
  this.subject //the subject name (collection name for DB) 
  this.conditions //the given conditions (collection object for DB) 
  this.user //the user if available 
  this.success //true if the action was allowed by any rules
}
```

## Configuration

### Routes

If you want iron:router to enforce your route access you will need to add the plugin.
Load order is important! You must define this after you declare all your routing rules.
I would place this at the bottom of a `/lib/candid.js` file.

###### NOTE: This depends on iron:router.

`Router.plugin('candidHook', options);`

Option: 
```
{
  permissionDeniedTemplate: 'PermissionDenied', //render a template
  permissionDeniedRoute: '/permissionDenied' //redirect to a route
}
```
If both options are defined it will render a template, 
if neither are defined it will throw a "permission-denied" error. 
Server routes always throw "permission-denied" errors.

TODO: find a way to reactively update the plugin options (e.g. {only: ['your routes']})

### Whitelisting 

Block all actions of a give type. 
This can include actions from other packages so I would recommend caution when using theses.


#### Can.settings.DbDeny = false
You can whitelist your database actions by removing the `insecure` package. 
Candid will create allows for all your db rules. 
Because it uses allow you can circumvent Candid security by adding your own allows.

If you would rather candid explicitly deny set this to true.
You will have to create your own allows for all your collections.

Candid will **only** create deny for the rules (dos) you have defined.

#### Can.settings.whitelistDB = true
Database whitelisting is enabled by default. 
This is because meteor denies DB writes if no allows pass.
If you have your own allow/deny calls you can set this to false and if no rules applies 
Candid will return true.

#### Can.settings.whitelistClient = false
Will catch all client routes. 

#### Can.settings.whitelistMethod = false
Method whitelisting may cause problems with other packages or even meteor core.
Depending on package load order expect results to be unpredictable.
Only methods defined after this package will be whitelisted (I think...)
while I don't recommend it, it is available to you.

#### Can.settings.whitelistHTTP = false
Will catch all HTTP routes with method == ['get', 'post', 'put', 'delete']


## Tests

Currently Candid is tested with tinytest. 
Run `meteor tests-packages /path/to/candid/clone` to see them for yourself.
