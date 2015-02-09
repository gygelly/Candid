Candid
===============

This is a work in progress and is not usable quite yet.

This is a Candid permissions layer for Meteor JS, inspired by Rails CanCan but adapted to Meteor!

### Rules: the dos 

Define once (lib) do anywhere

```js
Can.do({
  action: String,
  subject: String or Mongo.Collection instance
  condition: function (doc) {
    //optional, runs before user
    //if defined must return true to continue
  },
  user: function (user, doc) {
    //optional, if you have authentication or roles
    //if defined must return true to allow action
  }
})
```

### (Can)did: Full access logging

You should have known this was coming..

TODO: not implemented

```js
Can.did = function () {
  //stuff here
}

```

### helpers

```js
/*** insert, read, update, remove ***/
Can.can( 'action', subject )
//active authentication, returns boolean

/*** client, method, rest, get, post, put, delete ***/
Can.authorized( 'action', 'subject' ) 
//routing/method authentication, returns boolean
```

```html

<!-- TODO: all of these.... -->

{{#if can 'action' target}}
  ...
{{/if}}

{{#if authorized 'action' target}}
  ...
{{/if}}

```

### actions

* can/cannot
  * db
  * insert
  * read
  * update
  * remove

* authorize/authorized
  * client
  * method
  * http
  * get
  * post
  * put
  * delete

### subjects

* Methods! (via `_.wrap`, dependent on `this.connection`, server calls will not fire authorize)
* Automatically generate allow/deny for collections
* use _getCollectionName() for findOne
* Routing

### Routes

Router.plugin('candidHook'); 

Currently it throws a permission denied exception if no rules passed.

TODO: add an optional redirect to permission denied template

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

#### Can.settings.whitelistClient = false
Will catch all routes. 

#### Can.settings.whitelistMethod = false
Method whitelisting may cause problems with other packages or even meteor core.
Depending on package load order expect results to be unpredictable.
Only methods defined after this package will be whitelisted (I think...)
while I don't recommend it, it is available to you.

#### Can.settings.whitelistHTTP = false
Will catch all HTTP routes with method == ['get', 'post', 'put', 'delete']

