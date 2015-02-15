var Tests = new Mongo.Collection(null), collectionName;

setName = function (name) {
  Tests._name = name; //DONT ACTUALLY USE THIS COLLECTION!
  collectionName = name;
};

testCursor = {
  _getCollectionName: function () {
    return collectionName;
  }
};

testObj = {
  _getCollectionName: function () {
    return collectionName;
  }
};

Tinytest.add('candid - do db', function (test) {
  Can._destroyAllRules()
  setName('test1')

  Can.do({
    action: 'db',
    subject: Tests
  })

  test.isTrue(Can.can('db', Tests))
  test.isTrue(Can.can('insert', Tests))
  test.isTrue(Can.can('read', Tests))
  test.isTrue(Can.can('update', Tests))
  test.isTrue(Can.can('remove', Tests))

  test.isTrue(Can.can('db', testCursor))
  test.isTrue(Can.can('read', testCursor))
  test.isTrue(Can.can('update', testCursor))
  test.isTrue(Can.can('remove', testCursor))

  test.isTrue(Can.can('db', testObj))
  test.isTrue(Can.can('read', testObj))
  test.isTrue(Can.can('update', testObj))
  test.isTrue(Can.can('remove', testObj))
});

Tinytest.add('candid - do db insert', function (test) {
  Can._destroyAllRules()
  setName('test2')

  Can.do({
    action: 'insert',
    subject: Tests
  })

  test.isTrue(Can.can('db', Tests))
  test.isTrue(Can.can('insert', Tests))
  test.isFalse(Can.can('read', Tests))
  test.isFalse(Can.can('update', Tests))
  test.isFalse(Can.can('remove', Tests))

  test.isTrue(Can.can('db', testCursor))
  test.isFalse(Can.can('read', testCursor))
  test.isFalse(Can.can('update', testCursor))
  test.isFalse(Can.can('remove', testCursor))

  test.isTrue(Can.can('db', testObj))
  test.isFalse(Can.can('read', testObj))
  test.isFalse(Can.can('update', testObj))
  test.isFalse(Can.can('remove', testObj))
});

Tinytest.add('candid - do db read', function (test) {
  Can._destroyAllRules()
  setName('test3')

  Can.do({
    action: 'read',
    subject: Tests
  })

  test.isTrue(Can.can('db', Tests))
  test.isFalse(Can.can('insert', Tests))
  test.isTrue(Can.can('read', Tests))
  test.isFalse(Can.can('update', Tests))
  test.isFalse(Can.can('remove', Tests))

  test.isTrue(Can.can('db', testCursor))
  test.isTrue(Can.can('read', testCursor))
  test.isFalse(Can.can('update', testCursor))
  test.isFalse(Can.can('remove', testCursor))

  test.isTrue(Can.can('db', testObj))
  test.isTrue(Can.can('read', testObj))
  test.isFalse(Can.can('update', testObj))
  test.isFalse(Can.can('remove', testObj))
});

Tinytest.add('candid - do db update', function (test) {
  Can._destroyAllRules()
  setName('test4')

  Can.do({
    action: 'update',
    subject: Tests
  })

  test.isTrue(Can.can('db', Tests))
  test.isFalse(Can.can('insert', Tests))
  test.isFalse(Can.can('read', Tests))
  test.isTrue(Can.can('update', Tests))
  test.isFalse(Can.can('remove', Tests))

  test.isTrue(Can.can('db', testCursor))
  test.isFalse(Can.can('read', testCursor))
  test.isTrue(Can.can('update', testCursor))
  test.isFalse(Can.can('remove', testCursor))

  test.isTrue(Can.can('db', testObj))
  test.isFalse(Can.can('read', testObj))
  test.isTrue(Can.can('update', testObj))
  test.isFalse(Can.can('remove', testObj))
});

Tinytest.add('candid - do db remove', function (test) {
  Can._destroyAllRules()
  setName('test5')

  Can.do({
    action: 'remove',
    subject: Tests
  })

  test.isTrue(Can.can('db', Tests))
  test.isFalse(Can.can('insert', Tests))
  test.isFalse(Can.can('read', Tests))
  test.isFalse(Can.can('update', Tests))
  test.isTrue(Can.can('remove', Tests))

  test.isTrue(Can.can('db', testCursor))
  test.isFalse(Can.can('read', testCursor))
  test.isFalse(Can.can('update', testCursor))
  test.isTrue(Can.can('remove', testCursor))

  test.isTrue(Can.can('db', testObj))
  test.isFalse(Can.can('read', testObj))
  test.isFalse(Can.can('update', testObj))
  test.isTrue(Can.can('remove', testObj))
});

Tinytest.add('candid - do db none', function (test) {
  Can._destroyAllRules()
  setName('test6')

  test.isFalse(Can.can('db', Tests))
  test.isFalse(Can.can('insert', Tests))
  test.isFalse(Can.can('read', Tests))
  test.isFalse(Can.can('update', Tests))
  test.isFalse(Can.can('remove', Tests))

  test.isFalse(Can.can('db', testCursor))
  test.isFalse(Can.can('read', testCursor))
  test.isFalse(Can.can('update', testCursor))
  test.isFalse(Can.can('remove', testCursor))

  test.isFalse(Can.can('db', testObj))
  test.isFalse(Can.can('read', testObj))
  test.isFalse(Can.can('update', testObj))
  test.isFalse(Can.can('remove', testObj))
});
