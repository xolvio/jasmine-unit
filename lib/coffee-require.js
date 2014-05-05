var NODE_MODULES = process.env.PWD + '/packages/rtd-unit/.npm/package/node_modules',
    karmaCoffeePreprocessor = require(NODE_MODULES + '/karma-coffee-preprocessor')['preprocessor:coffee'][1](
        {options: { bare: true, sourceMap: false }}, {},
        require(NODE_MODULES + '/karma/lib/logger.js'),
        require(NODE_MODULES + '/karma/lib/helper.js')
    ),
    fs = require('fs'),
    vm = require('vm'),
    coffeeRequire = function (path) {
        var file = { originalPath: path };
        var code = fs.readFileSync(file.originalPath).toString();
        karmaCoffeePreprocessor(code, file, function (err, result) {
            if (!err) {
                vm.runInThisContext(result);
            } else {
                console.log(err);
            }
        });
    };

module.exports = coffeeRequire;