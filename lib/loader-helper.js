"use strict";

/**
 * See `velocityJasmineUnit` class
 * @module velocityJasmineUnit
 *
 * @example
 *     var stubLoader = require('./stub-loader.js'),
 *         fileLoader = require('./file-loader.js');
 *
 *     // load any stubs; auto-stub any templates found in Meteor app
 *     stubLoader.loadFrameworkStubs()
 *     stubLoader.stubTemplates();
 *     stubLoader.loadUserStubs()
 *     
 *     // load Meteor app source files prior to running tests
 *     fileLoader.loadFiles();
 *
 */

/**
 * @class velocityJasmineUnit
 */

var stubLoader = require('./stub-loader.js'),
    fileLoader = require('./file-loader.js');

// load stubs; auto-stub any templates found in Meteor app

try {
  stubLoader.loadFrameworkStubs();
  stubLoader.stubTemplates();
  stubLoader.loadUserStubs();
}
catch (ex) {
  console.log('Error loading stubs', ex.message, ex.stack);
}


// load Meteor app source files prior to running tests

try {
  fileLoader.loadFiles();
}
catch (ex) {
  console.log('Error loading app files', ex.message, ex.stack);
}
