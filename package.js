Package.describe({
  name: 'candid',
  summary: 'A candid Permissions layer for Meteor JS'
});

Package.on_use(function (api) {
   api.use(['underscore', 'dburles:mongo-collection-instances']);

   api.use('iron:router', ['client', 'server'], {weak: true});
   
   api.add_files([
    'lib/rules.js',
    'lib/can.js', 
    'lib/startup.js',
    'lib/methods.js',
    'lib/iron:router.js'
  ]);

   api.export(['Can']);
});

Package.on_test(function (api) {
  api.use('candid');
  api.use('tinytest');
  
  api.add_files('can-do_tests.js');
});