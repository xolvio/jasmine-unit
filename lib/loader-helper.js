"use strict";

var PWD = process.env.PWD;
var DEBUG = process.env.DEBUG;
var glob = require(PWD + '/packages/rtd-unit/.npm/package/node_modules/glob');
var htmlScanner = require('./html-scanner.js');

// TODO add coffee loading support

// Load RTD stubs
var files = glob.sync('**/*-stub.js', { cwd: PWD + '/packages/rtd-unit/stubs' });
for (var i in files) {
    require(PWD + '/packages/rtd-unit/stubs/' + files[i]);
}

// Load user-defined stubs
files = glob.sync('**/*-stub.js', { cwd: PWD + '/tests' });
for (i in files) {
    require(PWD + '/tests/' + files[i]);
}

// Stub templates
var templateNames = htmlScanner.findTemplateNames()
for (var i = templateNames.length - 1; i >= 0; i--) {
    DEBUG && console.log('stubbing template:', templateNames[i])
    Template.stub(templateNames[i]);
}

// TODO mimic the Meteor loading order behaviour here
require(PWD + '/leaderboard.js');
