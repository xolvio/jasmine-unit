"use strict";

var PWD = process.env.PWD;
var DEBUG = process.env.DEBUG;
var glob = require(PWD + '/packages/rtd-unit/.npm/package/node_modules/glob');
var fs = require('fs');
var path = require('path');

var htmlScanner = {
  findTemplateNames: function () {
    var files = glob.sync('**/*.html', { cwd: PWD }),
        templateNames = [],
        templateTag = /^<template\s+name=(['"]).*?\1/igm,
        contents,
        matches,
        i, j,
        match,
        name;

    DEBUG && console.log('[findTemplateNames]');
    DEBUG && console.log('PWD', PWD);
    DEBUG && console.log('files', files);

    for (i in files) {
      contents = fs.readFileSync(path.join(PWD, files[i]), 'utf-8');
      //contents = fs.readFileSync(path.join(PWD, files[i]), 'utf-8');
      matches = contents.match(templateTag);
      DEBUG && console.log('raw matches for file', files[i], matches);
      if (matches) {
        for (j = matches.length - 1; match = matches[j]; j--) {
          DEBUG && console.log('raw template', match);
          name = match.substring(match.indexOf('name=') + 6, match.length - 1);
          DEBUG && console.log('name', name);
          templateNames.push(name);
        }
      }
    }

    return templateNames;
    //return ['leaderboard', 'player']
  }
}

module.exports = htmlScanner
