"use strict";

// coffeeRequire

var fs = require('fs'),
    vm = require('vm'),
    path = require('path'),
    PWD = process.env.PWD,
    NODE_MODULES = path.join(PWD, 'packages','rtd-unit','.npm','package','node_modules'),
    karmaPath = path.join(NODE_MODULES, 'karma-coffee-preprocessor'),
    preprocessorGenerator = require(karmaPath)['preprocessor:coffee'][1],
    karmaLogger = require(path.join(NODE_MODULES, 'karma','lib','logger.js')),
    karmaHelper = require(path.join(NODE_MODULES, 'karma','lib','helper.js')),
    karmaOptions = {
      options: {
        bare: true,
        sourceMap: false
      }
    },
    karmaCoffeePreprocessor = preprocessorGenerator(karmaOptions, {}, karmaLogger, karmaHelper);

/**
 * Load and execute a coffeescript file.
 *
 * @method coffeeRequire
 * @param {String} target Path to coffeescript file to load.
 */
module.exports = function (target) {
  var file = {originalPath: target},
      code = fs.readFileSync(target).toString();

  karmaCoffeePreprocessor(code, file, function (err, result) {
    if (!err) {
      vm.runInThisContext(result);
    } else {
      console.log(err);
    }
  });
};
