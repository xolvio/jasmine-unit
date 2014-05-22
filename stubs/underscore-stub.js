/*jshint -W020, -W079 */
"use strict";

if ("undefined" === typeof _) {

  var _,
      DEBUG = 1,
      fn, i,
      emptyFn = function () {},
      collections = [
        'each',
        'map',
        'reduce',
        'reduceRight',
        'find',
        'filter',
        'where',
        'findWhere',
        'reject',
        'every',
        'some',
        'contains',
        'invoke',
        'pluck',
        'max',
        'min',
        'sortBy',
        'groupBy',
        'indexBy',
        'countBy',
        'shuffle',
        'sample',
        'toArray',
        'size'
      ],

      arrays = [
        'first',
        'initial',
        'last',
        'rest',
        'compact',
        'flatten',
        'without',
        'partition',
        'union',
        'intersection',
        'difference',
        'uniq',
        'zip',
        'object',
        'indexOf',
        'lastIndexOf',
        'sortedIndex',
        'range'
      ],
      
      functions = [
        'bind',
        'bindAll',
        'partial',
        'memoize',
        'delay',
        'defer',
        'throttle',
        'debounce',
        'once',
        'after',
        'now',
        'wrap',
        'compose'
      ],
        
      objects = [
        'keys',
        'values',
        'pairs',
        'invert',
        'functions',
        'extend',
        'pick',
        'omit',
        'defaults',
        'clone',
        'tap',
        'has',
        'matches',
        'property',
        'isEqual',
        'isEmpty',
        'isElement',
        'isArray',
        'isObject',
        'isArguments',
        'isFunction',
        'isString',
        'isNumber',
        'isFinite',
        'isBoolean',
        'isDate',
        'isRegExp',
        'isNaN',
        'isNull',
        'isUndefined'
      ],

      utility = [
        'noConflict',
        'identity',
        'constant',
        'times',
        'random',
        'mixin',
        'uniqueId',
        'escape',
        'unescape',
        'result',
        'template'
      ];

  _ = {}

  for (i = collections.length - 1; fn = collections[i]; i--) {
    _[fn] = emptyFn;
  }
  for (i = arrays.length - 1; fn = arrays[i]; i--) {
    _[fn] = emptyFn;
  }
  for (i = functions.length - 1; fn = functions[i]; i--) {
    _[fn] = emptyFn;
  }
  for (i = objects.length - 1; fn = objects[i]; i--) {
    _[fn] = emptyFn;
  }
  for (i = utility.length - 1; fn = utility[i]; i--) {
    _[fn] = emptyFn;
  }

  global._ = _;

}
