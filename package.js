Package.describe({
  name: 'candid',
  summary: 'A candid Permissions layer for Meteor JS'
});

Package.on_use(function (api) {
   api.use([
    'underscore', 
    'dburles:mongo-collection-instances@0.3.1', 
    'mongo',
    'dburles:collection-helpers@1.0.2',
    'ui'
    ]);

   api.use('iron:router', ['client', 'server'], {weak: true});
   
   api.add_files([
    'lib/rules.js',
    'lib/can.js', 
    'lib/startup.js',
    'lib/methods.js',
    'lib/iron:router.js',
    'temp.js',
    'lib/database.js',
    'lib/htmlHelpers.js'
  ]);

   api.export(['Can']);
});

Package.on_test(function (api) {
  api.use('candid');
  api.use('tinytest');
  
  api.add_files('can-do_tests.js');
});