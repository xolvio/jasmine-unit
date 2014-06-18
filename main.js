;(function () {

  "use strict";

  var ANNOUNCE_STRING = 'Velocity Jasmine-Unit is loaded',
      pwd = process.env.PWD,
      DEBUG = process.env.JASMINE_DEBUG,
      spawn = Npm.require('child_process').spawn,
      parseString = Npm.require('xml2js').parseString,
      glob = Npm.require('glob'),
      fs = Npm.require('fs'),
      path = Npm.require('path'),
      _ = Npm.require('lodash'),
      rimraf = Npm.require('rimraf'),
      testReportsPath = path.join(pwd, 'tests', '.reports', 'jasmine-unit'),
      args = [],
      consoleData = '',
      jasmineCli,
      closeFunc;


// build OS-independent path to jasmine cli
  jasmineCli = pwd + ',packages,jasmine-unit,.npm,package,node_modules,jasmine-node,lib,jasmine-node,cli.js'.split(',').join(path.sep);

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
  args.push(path.join(pwd, 'packages', 'jasmine-unit', 'lib'));
  args.push(path.join(pwd, 'tests'));

// How can we abstract this server-side so the test frameworks don't need to know about velocity collections
  VelocityTestFiles.find({targetFramework: 'jasmine-unit'}).observe({
    added: rerunTests,
    changed: rerunTests,
    removed: rerunTests
  });

  console.log(ANNOUNCE_STRING);



//////////////////////////////////////////////////////////////////////
// private functions
//

  function hashCode (s) {
    return s.split("").reduce(function (a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  var regurgitate = Meteor.bindEnvironment(function (data) {
    consoleData += data;
    if (consoleData.indexOf('\n') !== -1 && consoleData.trim()) {
      console.log(consoleData.trim());
      Meteor.call('postLog', {
        type: 'out',
        framework: 'jasmine-unit',
        message: consoleData.trim()
      });
      consoleData = '';
    }
  });

  closeFunc = Meteor.bindEnvironment(function () {
    var newResults = [],
        globSearchString = path.join('**', 'TEST-*.xml'),
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

  function rerunTests () {
    Meteor.call('resetLogs', {framework: 'jasmine-unit'});
    rimraf.sync(testReportsPath);

    PackageStubber.stubPackages({
      dontStub: ['moment'],
      outfile: path.join('tests', 'a1-package-stub.js')
    })

    var jasmineNode = spawn(process.execPath, args);
    jasmineNode.stdout.on('data', regurgitate);
    jasmineNode.stderr.on('data', regurgitate);
    jasmineNode.on('close', closeFunc);
  }


})();
