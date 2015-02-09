Package.describe({
  name: 'candid',
  summary: 'A candid Permissions layer for Meteor JS'
});

Package.on_use(function (api) {
   api.use(['underscore', 'dburles:mongo-collection-instances']);
   
   api.add_files([
    'lib/can.js', 
    'lib/rules.js',
    'lib/startup.js',
    'lib/methods.js'
  ]);

   api.export(['Can', 'can', 'cannot']);
});

Package.on_test(function (api) {
  api.use('candid');
  api.use('tinytest');
  
  api.add_files('can-do_tests.js');
});