var jasmineCli = process.env.PWD + '/packages/rtd-unit/.npm/package/node_modules/jasmine-node/lib/jasmine-node/cli.js',
    spawn = Npm.require('child_process').spawn,
    parseString = Npm.require('xml2js').parseString,
    glob = Npm.require('glob'),
    fs = Npm.require('fs'),
    _ = Npm.require('lodash'),
    args = [],
    TEST_REPORTS_DIR = process.env.PWD + '/tests/.reports/rtd-unit';

var hashCode = function (s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    },
    consoleData = '',
    regurgitate = function (data) {
        consoleData += data;
        if (consoleData.indexOf('\n') !== -1) {
            console.log(consoleData.trim());
            consoleData = '';
        }
    };
deleteFolderRecursive = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

args.push(jasmineCli);
args.push('--coffee');
args.push('--color');
args.push('--verbose');
args.push('--match');
args.push('.*-rtd-unit\.');
args.push('--matchall');
args.push('--junitreport');
args.push('--output');
args.push(TEST_REPORTS_DIR);
args.push(process.env.PWD + '/packages/rtd-unit/lib');
args.push(process.env.PWD + '/tests');

var closeFunc = Meteor.bindEnvironment(function () {
    var newResults = [],
        xmlFiles = glob.sync('**/TEST-*.xml', { cwd: TEST_REPORTS_DIR });
    _.each(xmlFiles, function (xmlFile, index) {
        parseString(fs.readFileSync(TEST_REPORTS_DIR + '/' + xmlFile), function (err, result) {
            _.each(result.testsuites.testsuite, function (testsuite) {
                _.each(testsuite.testcase, function (testcase) {
                    var result = ({
                        name: testcase.$.name,
                        framework: 'rtd-unit',
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
                    result.id = 'rtd-unit:' + hashCode(xmlFile + testcase.$.classname + testcase.$.name);
                    newResults.push(result.id);
                    Meteor.call('postResult', result);
                });
            });
        });
        if (index === xmlFiles.length - 1) {
            Meteor.call('resetReports', {framework: 'rtd-unit', notIn: newResults});
        }
    });
});

var rerunTests = function () {
    deleteFolderRecursive(TEST_REPORTS_DIR);
    var jasmineNode = spawn('/usr/local/bin/node', args);
    jasmineNode.stdout.on('data', regurgitate);
    jasmineNode.stderr.on('data', regurgitate);
    jasmineNode.on('close', closeFunc);
};

// How can we abstract this server-side so the test frameworks don't need to know about velocity collections
VelocityTestFiles.find({targetFramework: 'rtd-unit'}).observe({
    added: rerunTests,
    changed: rerunTests,
    removed: rerunTests
});

