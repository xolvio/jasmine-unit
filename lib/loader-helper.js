"use strict";

var PWD = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = require('fs'),
    glob = require(PWD + '/packages/rtd-unit/.npm/package/node_modules/glob'),
    path = require('path'),
    htmlScanner = require('./html-scanner.js'),
    coffeeRequire = require(PWD + '/packages/rtd-unit/lib/coffee-require');

loadFrameworkStubs();

loadUserStubs();

stubTemplates();

// TODO mimic the Meteor loading order behaviour here
loadFile ('leaderboard.js')
loadFile ('leaderboard.coffee')




// stubs
function loadUserStubs () {
  _loadStubs(glob, 'tests')
}
function loadFrameworkStubs () {
  var dir = path.join('packages', 'rtd-unit', 'stubs');
  _loadStubs(glob, dir)
}
function _loadStubs (glob, dir) {
  var pwd = process.env.PWD,
      cwd = path.join(pwd, dir),
      files, i;

  files = glob.sync('**/*-stub.js', { cwd: cwd });
  for (i in files) {
    require(path.join(pwd, dir, files[i]));
  }
}

// templates
function stubTemplates () {
  var templateNames = htmlScanner.findTemplateNames(),
      i = templateNames.length - 1;

  for (; i >= 0; i--) {
    DEBUG && console.log('stubbing template:', templateNames[i]);
    Template.stub(templateNames[i]);
  }
}

// files
function loadFile (target) { 
  var pwd = process.env.PWD,
      filename = path.join(pwd, target),
      ext;

  if (fs.existsSync(filename)) {
    ext = path.extname(filename);
    if ('.js' === ext) {
      require(filename);
    } else if ('.coffee' === ext) {
      coffeeRequire(filename);
    }
  }
}
