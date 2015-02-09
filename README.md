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

### helpers

```js
/*** insert, read, update, remove ***/
Can.can( 'action', target )
//active authentication, returns boolean

//TODO: currently this will always fail: I still have not yet added the helper _getCollectionName to collection instances.


/*** client, method, rest, get, post, put, delete ***/

Can.authorize( 'action', target ) 
//authorization, throws exception on failure

Can.authorized( 'action', target ) 
//routing/method authentication, returns boolean
```

```html

<!-- TODO: all of these.... -->

{{#if can 'action' target}}
  ...
{{/if}}

{{#if cannot 'action' target}}
  ...
{{/if}}

{{#if authorized 'action' target}}
  ...
{{/if}}

```

### actions

TODO: limit actions to the following list

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

### targets

* Methods! (via `_.wrap`, dependent on `this.connection`, server calls will not fire authorize)
* TODO: gen allow/deny 
* TODO: use _getCollectionName() for cursors
* TODO: use _getCollectionName() for findOne
* TODO: use _name for Collections
* TODO: Routing

### Routes

TODO: all of this...

routes create a Can iron:router hook
It should hook for each route and based on name do an optional redirect to permission denied

### Error catching 

TODO: all of this...

If authorize throw an error, provide a way to catch this error client side

```js
Can.rescue = function () {
  //do something intelligent
};
```

ALT-IDEA: canDo could be a reactive var on the client side. You could do something like toast the error.


### Whitelisting 

Block all actions of a give type. 
This can include actions from other packages. 
This should be considered an extreme option and only used if you are sure you know what you are doing.


```js
//not implemented
Can.settings.whitelistDB = false

//not implemented
Can.settings.whitelistClient = false

//Method whitelisting may cause problems with other packages or even meteor core.
//Depending on package load order expect results to be unpredictable.
//Only methods defined after this package will be whitelisted (I think...)
//while I don't recommend it, it is available to you.
Can.settings.whitelistMethod = false

//not implemented
Can.settings.whitelistHTTP = false
```



### did

full access logging

```js
Can.did('all', null, function (success) { //if the action was allowed
  this.user
  this.action
  this.subjectName
  this.condition
})

```
