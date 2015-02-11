Meteor.methods({
  method1: function () {
    return true;
  },
  method2: function (a, b) {
    return a && b;
  }
});

Tinytest.add('candid - do method', function (test) {

  Can.do({
    action: 'method', 
    subject: 'method1'
  })

  test.isTrue(Can.authorized('method', 'test1'))
});

Tinytest.add('candid - do method with args', function (test) {

  Can.do({
    action: 'method', 
    subject: 'method2',
    condition: function (a, b) {
      return a === 'a' && b === 'b';
    }
  })

  test.isTrue(Can.authorized('method', 'method2', ['a', 'b']))
});