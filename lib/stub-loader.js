"use strict";

// stub loader

var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    path = require('path'),
    glob = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/glob');

module.exports = {

  /**
   * Load framework-supplied stubs.
   *
   * @method loadFrameworkStubs 
   */
  loadFrameworkStubs: function () {
    require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/meteor-stubs');
    MeteorStubs.install();
  },

  /**
   * Load user-defined stubs.  Stub files should be located in the 'tests' 
   * directory and end in `-stub.js` or `-stubs.js`.
   *
   * Example:
   *   tests/custom-stub.js
   *   tests/custom-stubs.js
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
    var scanner = require('./template-scanner.js'),
        templateNames = scanner.findTemplateNames(),
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

  files = glob.sync('**/*-stubs.js', { cwd: cwd });
  for (i in files) {
    DEBUG && console.log('loading stub file:', files[i]);
    require(path.join(PWD, dir, files[i]));
  }
}
