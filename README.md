CanDo
===============

This is a work in progress and is not usable quite yet.

CanDo is a full permissions layer for Meteor JS, inspired by Rails CanCan but adapted to Meteor!

### do

```js
Can.do(function () {
  this.user 
  this.do( 'action', target, callback )
  this.dont( 'action', target, callback )
})
```

### helpers

```js
/*** insert, read, update, remove ***/
Can.can( 'action', target )
//active authentication, returns boolean
Can.cannot( 'action', target )
//passive authentication, returns boolean

/*** client, method, rest, get, post, put, delete ***/

TODO: create these helpers and add exception logic

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
  * all
  * insert
  * read
  * update
  * remove

* authorize/authorized
  * all
  * client
  * method
  * rest
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