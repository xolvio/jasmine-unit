"use strict";

/**
 * See `rtdUnit` class
 * @module rtdUnit
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
 * @class rtdUnit
 */

var stubLoader = require('./stub-loader.js'),
    fileLoader = require('./file-loader.js');

// load any stubs; auto-stub any templates found in Meteor app
stubLoader.loadFrameworkStubs()
stubLoader.stubTemplates();
stubLoader.loadUserStubs()

// load Meteor app source files prior to running tests
fileLoader.loadFiles();
