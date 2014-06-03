"use strict";

// loadOrderSort

var PWD = process.env.PWD,
    path = require('path'),
    _ = require(PWD + '/packages/jasmine-unit/.npm/package/node_modules/lodash');

/**
 * Returns a sort comparator to order files into Meteor app load order.
 * templateExtensions should be a list of extensions like 'html'
 * which should be loaded before other extensions.
 *
 * source: Meteor core file
 *   https://github.com/meteor/meteor/blob/devel/tools/packages.js#L47-L97
 *   May 5, 2014
 *
 * @method loadOrderSort 
 * @param {Array} [templateExtensions} Optional array of extensions which will
 *                be loaded first.
 * @return {Number} Either 1 or -1 depending on sort result
 */
module.exports = function (templateExtensions) {
  var templateExtnames = {};
  _.each(templateExtensions, function (extension) {
    templateExtnames['.' + extension] = true;
  });

  return function (a, b) {
    // XXX MODERATELY SIZED HACK --
    // push template files ahead of everything else. this is
    // important because the user wants to be able to say
    //   Template.foo.events = { ... }
    // in a JS file and not have to worry about ordering it
    // before the corresponding .html file.
    //
    // maybe all of the templates should go in one file?
    var isTemplate_a = _.has(templateExtnames, path.extname(a));
    var isTemplate_b = _.has(templateExtnames, path.extname(b));
    if (isTemplate_a !== isTemplate_b) {
      return (isTemplate_a ? -1 : 1);
    }

    // main.* loaded last
    var ismain_a = (path.basename(a).indexOf('main.') === 0);
    var ismain_b = (path.basename(b).indexOf('main.') === 0);
    if (ismain_a !== ismain_b) {
      return (ismain_a ? 1 : -1);
    }

    // /lib/ loaded first
    var islib_a = (a.indexOf(path.sep + 'lib' + path.sep) !== -1 ||
                   a.indexOf('lib' + path.sep) === 0);
    var islib_b = (b.indexOf(path.sep + 'lib' + path.sep) !== -1 ||
                   b.indexOf('lib' + path.sep) === 0);
    if (islib_a !== islib_b) {
      return (islib_a ? -1 : 1);
    }

    // deeper paths loaded first.
    var len_a = a.split(path.sep).length;
    var len_b = b.split(path.sep).length;
    if (len_a !== len_b) {
      return (len_a < len_b ? 1 : -1);
    }

    // otherwise alphabetical
    return (a < b ? -1 : 1);
  };
};
