"use strict";

// template scanner

var PWD = process.env.PWD,
    fs = require('fs'),
    path = require('path'),
    glob = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/glob'),
    _ = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/lodash'),
    fileLoader = require('./file-loader.js'),
    supportedFileTypes;  

module.exports = {

  /**
   * Scan files in Meteor app and return list of template names.
   *
   * Excluded directories: private, public, programs, tests
   *
   * @method findTemplateNames
   * @param {String} [targetDir] Optional path to directory to scan.
   *                             Default: PWD
   * @return {Array} list of template names
   */
  findTemplateNames: function (targetDir) {
    var excludeDirs = ['private', 'public', 'programs', 'tests'],
        templateNames = [];

    _.each(supportedFileTypes, function (fileType) {
      var files,
          filteredFiles,
          templateTag;

      files = glob.sync(fileType.globSearchPath, { cwd: targetDir || PWD });

      templateTag = fileType.matchPattern;

      // Don't exclude 'packages' directory since there are packages that
      // add important templates to the app
      filteredFiles = fileLoader.filterFiles(files, excludeDirs);

      _.each(filteredFiles, function (filePath) {
        var isPackage = filePath.indexOf('packages') == 0,
            fileContents,
            matches;

        if (isPackage && !isInPackageJs(filePath)) {
          // Skip file.  Not actually used in package (ex. an example app)
          return;
        }

        fileContents = fs.readFileSync(path.join(PWD, filePath), 'utf-8');
        matches = fileContents.match(templateTag);

        if (matches) {
          _.each(matches, function (match) {
            var name = fileType.nameExtractor(match);
            templateNames.push(name);
          });
        }
      });
    });

    return templateNames;
  }

};  // end module.exports


/**
 * Config data for each of the supported file types to search for 
 * template names.
 */
supportedFileTypes = {

  html: {
    // ex: <template name='leaderboard'>
    globSearchPath: '**/*.html',
    matchPattern: /^<template\s+name=(['"]).*?\1/igm,
    nameExtractor: function (match) {
      return match.substring(match.indexOf('name=') + 6, match.length - 1);
    }
  },

  jade: {
    // ex:  template(name='leaderboard')
    globSearchPath: '**/*.jade',
    matchPattern: /^\s*template\s*\(\s*name=(['"]).*?\1/igm,
    nameExtractor: function (match) {
      return match.substring(match.indexOf('name=') + 6, match.length - 1);
    }
  }

};


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



/**
 * Determines if a filePath is used by a package.  It is not enough to be
 * in the package's directory tree, it must also be found in the package.js
 * file, otherwise its probably a test file or part of an example app.
 *
 * @method isinpackagejs
 * @param {String} filePath
 * @return {Boolean} true if filePath is in package and actually used
 */
function isInPackageJs (filePath) {
  var packageJs = {},
      packageName,
      filename,
      regex;

  // check to see if this file is actually included in the package 
  // or if its extra stuff (like an example app)
  packageName = fileLoader.getPackageName(filePath);
  filename = path.basename(filePath);
  try {
    packageJs.path = _p(PWD + "/packages/" + packageName + "/package.js");
    packageJs.contents = fs.readFileSync(packageJs.path);
    regex = new RegExp(filename);

    // xxx A very simple test, just checks to see if filename is in 
    // package.js file.  Better to just check against `Package.on_use` only
    if (regex.test(packageJs.contents)) {
      return true
    } else {
      // this file is not in package.js;  skip
      return false
    }
  } catch (ex) {
    // something went wrong, skip file
    DEBUG && console.log('[TemplateScanner.isInPackage] error', ex.message)
    return false
  }
}  // end isInPackageJs
