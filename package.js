Package.describe({
  name: 'kestanous:candid',
  summary: 'A candid Permissions layer for Meteor JS',
  version: "0.1.5",
  git: "https://github.com/Meteor-Reaction/Candid.git"
});

Package.on_use(function (api) {
   api.use([
    'underscore@1.0.2', 
    'dburles:mongo-collection-instances@0.3.1', 
    'mongo@1.0.11',
    'dburles:collection-helpers@1.0.2',
    'ui@1.0.5' //blaze refused to accept Template.registerHelper
    ]);

   api.use('iron:router@1.0.0', ['client', 'server'], {weak: true});
   
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
  api.use('kestanous:candid');
  api.use([
    'accounts-base',
    'tinytest',
    'tracker',
    'mongo',
    'underscore',
    'tinytest',
    'iron:router'
    ]);
  
  api.add_files([
    'tests/database.js',
    'tests/router.js'
    ]);
});