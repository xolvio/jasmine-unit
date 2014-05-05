"use strict";

var htmlScanner = {
  findTemplateNames: function (targetDir) {
    var PWD = process.env.PWD,
        fs = require('fs'),
        path = require('path'),
        glob = require(PWD + '/packages/rtd-unit/.npm/package/node_modules/glob'),
        files = glob.sync('**/*.html', { cwd: targetDir || PWD }),
        templateNames = [],
        templateTag = /^<template\s+name=(['"]).*?\1/igm,
        fileContents,
        matches,
        i, j,
        match,
        name;

    for (i in files) {
      fileContents = fs.readFileSync(path.join(PWD, files[i]), 'utf-8');
      matches = fileContents.match(templateTag);
      if (matches) {
        for (j = matches.length - 1; match = matches[j]; j--) {
          name = match.substring(match.indexOf('name=') + 6, match.length - 1);
          templateNames.push(name);
        }
      }
    }

    return templateNames;
  }
};

module.exports = htmlScanner
