"use strict";

// stub loader

var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    path = require('path'),
    glob = require(PWD + '/packages/velocity-jasmine-unit/.npm/package/node_modules/glob');

module.exports = {

  /**
   * Load framework-supplied stubs.  Stub files are located in the 
   * 'packages/velocity-jasmine-unit/stubs' directory and end in -stub.js
   *
   * Example:
   *   packages/velocity-jasmine-unit/stubs/meteor-stub.js
   *
   * @method loadFrameworkStubs 
   */
  loadFrameworkStubs: function () {
    var dir = path.join('packages', 'velocity-jasmine-unit', 'stubs');
    _loadStubs(dir);
  },

  /**
   * Load user-defined stubs.  Stub files should be located in the 'tests' 
   * directory and end in -stub.js
   *
   * Example:
   *   tests/custom-stub.js
   *
   * @method loadUserStubs
   */
  loadUserStubs: function () {
    _loadStubs('tests');
  },

  /**
   * Create stubs for each template defined in the Meteor app.
   *
   * @method stubTemplates
   */
  stubTemplates: function () {
    var htmlScanner = require('./html-scanner.js'),
        templateNames = htmlScanner.findTemplateNames(),
        i = templateNames.length - 1;

    for (; i >= 0; i--) {
      DEBUG && console.log('stubbing template:', templateNames[i]);
      Template.stub(templateNames[i]);
    }
  }

};

function _loadStubs (dir) {
  var cwd = path.join(PWD, dir),
      files, i;

  files = glob.sync('**/*-stub.js', { cwd: cwd });
  for (i in files) {
    DEBUG && console.log('loading stub file:', files[i]);
    require(path.join(PWD, dir, files[i]));
  }
}
