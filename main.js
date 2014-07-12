/*jshint -W117, -W030, -W044, -W016  */
/* global
 Velocity:true,
 DEBUG:true
 */

(function () {

  "use strict";

  var ANNOUNCE_STRING = 'Jasmine-Unit is loaded',
      pwd = process.env.PWD,
      DEBUG = process.env.JASMINE_DEBUG,
      spawn = Npm.require('child_process').spawn,
      parseString = Npm.require('xml2js').parseString,
      glob = Npm.require('glob'),
      fs = Npm.require('fs'),
      path = Npm.require('path'),
      rimraf = Npm.require('rimraf'),
      testReportsPath = _p(pwd + '/tests/.reports/jasmine-unit'),
      args = [],
      jasmineCli,
      closeFunc,
      rerunTests,
      RUN_TEST_THROTTLE_TIME = 100;


  //////////////////////////////////////////////////////////////////////
  // set up jasmine cli arguments
  //

  // OS-independent path to jasmine cli
  jasmineCli = _p(pwd + '/packages/jasmine-unit/.npm/package/node_modules/jasmine-node-reporter-fix/lib/jasmine-node/cli.js');

  args.push(jasmineCli);
  args.push('--coffee');
  args.push('--color');
  args.push('--verbose');
  args.push('--match');
  args.push('.*-jasmine-unit\.');
  args.push('--matchall');
  args.push('--junitreport');
  args.push('--output');
  args.push(testReportsPath);
  args.push(_p(pwd + '/packages/jasmine-unit/lib'));
  args.push(_p(pwd + '/tests'));


  //////////////////////////////////////////////////////////////////////
  // private functions
  //



  /**
   * Reports test results back to velocity core.  Called once jasmine child
   * process exits
   *
   * @method closeFunc
   * @private
   */
  closeFunc = Meteor.bindEnvironment(function () {
    var newResults = [],
        globSearchString = _p('**/TEST-*.xml'),
        xmlFiles = glob.sync(globSearchString, { cwd: testReportsPath });

    _.each(xmlFiles, function (xmlFile, index) {
      parseString(fs.readFileSync(testReportsPath + path.sep + xmlFile), function (err, result) {
        _.each(result.testsuites.testsuite, function (testsuite) {
          _.each(testsuite.testcase, function (testcase) {
            var result = ({
              name: testcase.$.name,
              framework: 'jasmine-unit',
              result: testcase.failure ? 'failed' : 'passed',
              timestamp: testsuite.$.timestamp,
              time: testcase.$.time,
              ancestors: [testcase.$.classname]
            });

            if (testcase.failure) {
              _.each(testcase.failure, function (failure) {
                result.failureType = failure.$.type;
                result.failureMessage = failure.$.message;
                result.failureStackTrace = failure._;
              });
            }
            result.id = 'jasmine-unit:' + hashCode(xmlFile + testcase.$.classname + testcase.$.name);
            newResults.push(result.id);
            Meteor.call('postResult', result);
          });
        });
      });

      if (index === xmlFiles.length - 1) {
        Meteor.call('resetReports', {framework: 'jasmine-unit', notIn: newResults});
        Meteor.call('completed', {framework: 'jasmine-unit'});
      }
    });
  });  // end closeFunc


  /**
   * Runs tests and logs results to velocity core.
   *
   * @method rerunTests
   * @private
   */
  function _rerunTests () {
    Meteor.call('resetLogs', {framework: 'jasmine-unit'});
    rimraf.sync(testReportsPath);

    PackageStubber.stubPackages();

    DEBUG && console.log('jasmine cli: ', process.execPath, args.join(' '));

    var jasmineNode = spawn(process.execPath, args);
    jasmineNode.stdout.pipe(process.stdout);
    jasmineNode.stderr.pipe(process.stderr);
    jasmineNode.on('close', closeFunc);
  }  // end closeFunc


  /**
   * Lets us write paths unix-style but still be
   * cross-platform compatible
   *
   * @method _p
   * @param {String} unixPath path with unix-style separators
   * @return {String} path with platform-appropriate separator
   * @private
   */
  function _p (unixPath) {
    return unixPath.replace('\/', path.sep);
  }


  function hashCode (s) {
    return s.split("").reduce(function (a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }


  /**
   * Implementation of underscore's `throttle` function which uses
   * Meteor.setTimeout instead of the regular one.
   *
   * @method _throttle
   * @private
   */
  function _throttle (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var _now = Date.now || function () { return new Date().getTime(); };
    options || (options = {});
    var later = function () {
      previous = options.leading === false ? 0 : _now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function () {
      var now = _now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        Meteor.clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = Meteor.setTimeout(later, remaining);
      }
      return result;
    };
  }  // end _throttle


  // Help prevent unnecessary duplicate test runs by giving velocity core
  // some time to notify changes before re-running tests.
  // We don't need the actual file names since jasmine will just execute
  // all the matching test files each time it's run.
  rerunTests = _throttle(_rerunTests, RUN_TEST_THROTTLE_TIME, {leading: false});


//////////////////////////////////////////////////////////////////////
// Register the observe that will kick things off
//

  // TODO: How can we abstract this server-side so the test frameworks 
  // don't need to know about velocity collections
  VelocityTestFiles.find({targetFramework: 'jasmine-unit'}).observe({
    added: rerunTests,
    changed: rerunTests,
    removed: rerunTests
  });

  console.log(ANNOUNCE_STRING);

})();
