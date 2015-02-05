Package.describe({
  name: 'can-do',
  summary: ''
});

Package.on_use(function (api) {
   api.use('underscore');
   

   /*
    * Add files that should be used with this
    * package.
    */
   api.add_files(['can.js', 'rules.js', 'hacks.js']);

  /*
   * Export global symbols.
   *
   * Example:
   *  
   */
   api.export(['Can', 'can', 'cannot']);
});

Package.on_test(function (api) {
  api.use('can-do');
  api.use('tinytest');
  
  api.add_files('can-do_tests.js');
});