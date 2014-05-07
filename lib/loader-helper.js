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

// load any stubs; auto-stub any templates found in Meteor app
stubLoader.loadFrameworkStubs();
stubLoader.stubTemplates();
stubLoader.loadUserStubs();

// load Meteor app source files prior to running tests
fileLoader.loadFiles();
