var createRoute = function (name, options) {
  options = options || {};
  options['name'] = name
  Router.route('/' + name, options);
}

Tinytest.add('candid - do client route', function (test) {
  createRoute('test1')

  Can.do({
    action: 'client', 
    subject: 'test1'
  })

  test.isTrue(Can.authorized('client', 'test1'))
});