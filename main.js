;
(function () {

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

    stubPackages()

    var jasmineNode = spawn(process.execPath, args);
    jasmineNode.stdout.on('data', regurgitate);
    jasmineNode.stderr.on('data', regurgitate);
    jasmineNode.on('close', closeFunc);
  }

  function getTestPackageNames (pwd, path, glob) {
    var smartJsonFiles,
        names = []
        
    smartJsonFiles = glob.sync(path.join("**","smart.json"), 
                               {cwd: path.join(pwd, "packages")})

    _.each(smartJsonFiles, function (filePath) {
      var smartJson,
          fullPath = path.join(pwd, "packages", filePath);

      try {
        smartJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
        if (smartJson && smartJson.testPackage) {
          names.push(path.dirname(filePath))
        }
      } 
      catch (ex) {
        DEBUG && console.log(filePath, ex)
      }
    })

    return names
  }  // end getTestPackageNames 


  function getPackageExports (pwd, path, glob, packagesToIgnore) {
    var packageJsFiles,
        packageExports = [],
        exportsRE = /api\.export\s*\(\s*(['"])(.*?)\1/igm;
        
    packageJsFiles = glob.sync(path.join("**", "package.js"), 
                               {cwd: path.join(pwd, "packages")})

    _.each(packageJsFiles, function (filePath) {
      var file,
          found;

      if (shouldIgnorePackage(packagesToIgnore, filePath)) {
        DEBUG && console.log('ignoring', path.dirname(filePath))
        return
      }

      // api.export('Roles')
      // api.export('moment')

      try {
        file = fs.readFileSync(path.join(pwd, "packages", filePath), 'utf8')
        while(found = exportsRE.exec(file)) {
          DEBUG && console.log('found export', filePath, found[2])
          packageExports.push(found[2])
        }
      } catch (ex) {
        DEBUG && console.log('error reading file', filePath, ex)
      }

      // populate the packageExports array
    })

    return packageExports
  }  // end getPackageExports


  function stubPackages () {
    var stubs = {},
        packageJsFiles,
        packageExports = [],
        packagesToIgnore,
        smartJsonFiles,
        ignoreString,
        ignoreRegex,
        out = "",
        outfile;

    outfile = path.join(pwd, 'tests', 'a1-package-stub.js')

    // identify packages to ignore (ie. test packages)
    packagesToIgnore = getTestPackageNames(pwd, path, glob)
    packagesToIgnore.push('velocity')
    
    packageExports = getPackageExports(pwd, path, glob, packagesToIgnore)


    // build stubs
    // Robert
    _.each(packageExports, function (name) {
      DEBUG && console.log('mocking', name)
      // mock global[name] object and stick it on the stubs object as stubs[name]
      makeMock(name, stubs)
    })

    // prep for file write - convert stubs to string
    for (var name in stubs) {
      out += name + " = " + stubs[name].toString() + ";";
    }

    fs.writeFileSync(outfile, out)
  }  // end stubPackages

  function stubObject (target, dest) {
    for (var field in target) {
      var type = typeof target[field]
      switch (type) {
        case "number":
          dest[field] = target[field]
          break;
        case "string":
          dest[field] = target[field]
          break;
        case "function":
          dest[field] = emptyFn;
          break;
        case "object":
          if (target[field] === null) {
            dest[field] = null
          } else if (target[field] instanceof Date) {
            dest[field] = new Date(target[field])
          } else {
            stubObject(target[field], dest[field])
          }
          break;
      }
    }
  }

  function shouldIgnorePackage (packagesToIgnore, packagePath) {
    return _.some(packagesToIgnore, function (packageName) {
      return packagePath.indexOf(packageName) == 0
    })
  }
  function makeMock (name, dest) {
    var self = this,
        target = global[name],
        isFunction = false;

    if (typeof target == 'function') {
      isFunction = true;
      target = target();
    }

    stubObject(target, dest)


/*
    var metadata = moduleMocker.getMetadata(target);
    // console.log("\n\n\n############ Test string (moment):\n\n", moment().format('MMMM Do YYYY, h:mm:ss a'));
    // console.log("\n\n\n############ moment.format:\n\n", global['moment']().format );
    // console.log("\n\n\n############ Metadata:\n\n", metadata );
    var mock = moduleMocker.generateFromMetadata(metadata);
    console.log("\n\n\n############ Test string (mock):\n\n", mock.format('MMMM Do YYYY, h:mm:ss a'));
    console.log("\n called with", mock.format.mock.calls)
    //console.log("\n\n\n############ Mock:\n\n", mock );
    //fs.writeFileSync(path.join(pwd, "test.log"), JSON.stringify(mock.format.mock))

    var tmp = {};

    for (var field in mock) {
      if (field != 'toString') {
        tmp[field] = mock[field]
      }
    }
    console.log(tmp)
    //fs.writeFileSync(path.join(pwd, "test.log"), JSON.stringify(tmp))

*/


/*
    if (name === 'moment') {
      if (isFunction) {
        dest[name] = "function () { return " + mock.toString() + " }"
      } else {
        dest[name] = mock
      }
      //dest[name] = function () { return { format: function () {} } }
      // boundMock = function (args) { return (function () {return mock}).apply(self, args)}
      // dest[name] = _.bind(mock, self);
    }
*/

  }  // end makeMock


})();


