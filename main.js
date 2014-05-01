console.log('**** RESTARTED *****');
//Npm.require('jasmine-node').executeSpecsInFolder({
//    specFolders: ['/Users/sam/WebstormProjects/rtd/rtd-unit/example/tests/simple.js']
//});

console.log('node ' + process.env.PWD + '/packages/rtd-unit/.npm/package/node_modules/jasmine-node/lib/jasmine-node/cli.js', '/Users/sam/WebstormProjects/rtd/rtd-unit/example/tests/simple.js');

var testFile1 = '/Users/sam/Webstorm/rtd2/rtd-unit/example/tests/simple.js';
var testFile2  = '/Users/sam/Webstorm/rtd2/rtd-unit/example/tests/leaderboard.js';
var stubsFolder = process.env.PWD + '/packages/rtd-unit/helpers/';

var jasmineCli = process.env.PWD + '/packages/rtd-unit/.npm/package/node_modules/jasmine-node/lib/jasmine-node/cli.js',
    spawn = Npm.require('child_process').spawn,
    args = [];

args.push(jasmineCli);
args.push('--matchall');
args.push('--coffee');
args.push(stubsFolder);
//args.push(testFile1);
args.push(testFile2);

jasmineNode = spawn('/usr/local/bin/node', args);

jasmineNode.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});