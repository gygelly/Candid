Tests = new Mongo.Collection('tests');
testCursor = Tests.find(Tests.insert({}));
testObj = Tests.find(Tests.insert({}));

Tinytest.add('candid - do db', function (test) {
  Can.do({
    action: 'db', 
    subject: Tests
  })

  test.ok(Can.can('db', Tests))
  test.ok(Can.can('insert', Tests))
  test.ok(Can.can('read', Tests))
  test.ok(Can.can('update', Tests))
  test.ok(Can.can('remove', Tests))

  test.ok(Can.can('db', testCursor))
  test.ok(Can.can('read', testCursor))
  test.ok(Can.can('update', testCursor))
  test.ok(Can.can('remove', testCursor))

  test.ok(Can.can('db', testObj))
  test.ok(Can.can('read', testObj))
  test.ok(Can.can('update', testObj))
  test.ok(Can.can('remove', testObj))


});