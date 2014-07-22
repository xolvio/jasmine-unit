"use strict";

// file loader

var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = require('fs'),
    path = require('path'),
    _ = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/lodash'),
    glob = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/glob'),
    loadOrderSort = require('./load-order-sort.js'),
    coffeeRequire = require('./coffee-require');


module.exports = {
  loadFiles: loadFiles,
  getJsFiles: getJsFiles,
  getCoffeeFiles: getCoffeeFiles,
  filterFiles: filterFiles,
  loadFile: loadFile,
  getPackageName: getPackageName
};



/**
 * Loads a Meteor app's javascript and coffeescript files.
 * Matches Meteor core's load order.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method loadFiles
 */
function loadFiles () {
  var files = _.union(getJsFiles(), getCoffeeFiles());

  files.sort(loadOrderSort([]));
  _.each(files, loadFile);
}

/**
 * Returns list of javascript filenames in Meteor app.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method getJsFiles
 * @return {Array.<String>} list of filenames
 */
function getJsFiles () {
  var files = glob.sync('**/*.js', { cwd: PWD });

  return filterFiles(files);
}

/**
 * Returns list of coffeescript files in Meteor app.
 *
 * Excluded directories: private, public, programs, packages, tests
 *
 * @method getCoffeeFiles
 * @return {Array.<String>} list of filenames
 */
function getCoffeeFiles () {
  var files = glob.sync('**/*.coffee', { cwd: PWD });

  return filterFiles(files);
}


/**
 * Filters out files that are in the app but are not 'user' files.
 * For example, files from packages or that are in the private or tests 
 * directory
 *
 * @method filterFiles
 * @param {Array} files list of filenames to filter
 * @param {Array|String} [excludeDirs] list of directories to exclude.
 *                       Default: private, public, programs, packages, tests
 * @return {Array} filenames
 */
function filterFiles (files, excludeDirs) {
  if ('string' === typeof excludeDirs) {
    excludeDirs = [excludeDirs];
  }

  excludeDirs = excludeDirs || 
                    ['private', 'public', 'programs', 'packages', 'tests'];

  if (!_.isArray(excludeDirs)) {
    throw new Error("[filterFiles] Optional field 'excludeDirs' must " +
                                   "be an array or string.");
  }

  return _.filter(files, function _shouldInclude (filePath) {
    var dirs = filePath.split(path.sep);

    // if filePath contains any of the excluded directories, 
    // then should not include that filePath
    return !_.some(dirs, function (dir) {
      return excludeDirs.indexOf(dir) !== -1;
    });
  });
}



/**
 * Load and execute the target source file.
 * Will use node's 'require' if source file has a .js extension or
 * coffeescript preprocessor if a .coffee extension
 *
 * @method loadFile
 * @param {String} target file path to load, relative to meteor app
 */
function loadFile (target) {
  var pwd = process.env.PWD,
      filename = path.join(pwd, target),
      ext;

  if (fs.existsSync(filename)) {
    ext = path.extname(filename);
    if ('.js' === ext) {
      DEBUG && console.log('loading source file:', filename);
      require(filename);
    } else if ('.coffee' === ext) {
      DEBUG && console.log('loading source file:', filename);
      coffeeRequire(filename);
    }
  }
}



/**
 * Get the name of a package from a filePath relative to the app directory.
 *
 * ex. 
 *   getPackageName('packages/roles/example/router/client.html') => 'roles'
 *
 * @method getPackageName
 * @param {String} filePath path to a file, relative to the app directory
 * @return {String} the name of the package, if any that the file belongs to
 */
function getPackageName (filePath) {
  var temp,
      packageConst = 'packages' + path.sep;

  if (filePath.indexOf(packageConst) !== 0) {
    return '';
  }

  temp = filePath.substring(packageConst.length);
  return temp.substring(0, temp.indexOf(path.sep));
}
