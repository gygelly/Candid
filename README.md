CanDo
===============

This is a work in progress and is not usable quite yet.

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
can( 'action', target )
//active authentication, returns boolean
cannot( 'action', target )
//passive authentication, returns boolean

/*** client, method, rest, get, post, put, delete ***/

TODO: create these helpers and add exception logic

authorize( 'action', target ) 
//authorization, throws exception on failure

authorized( 'action', target ) 
//routing/method authentication, returns boolean
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

* Methods! (via _.wrap)
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