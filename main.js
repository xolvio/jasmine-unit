console.log('**** RESTARTED *****');
//Npm.require('jasmine-node').executeSpecsInFolder({
//    specFolders: ['/Users/sam/WebstormProjects/rtd/rtd-unit/example/tests/simple.js']
//});

var jasmineCli = process.env.PWD + '/packages/rtd-unit/.npm/package/node_modules/jasmine-node/lib/jasmine-node/cli.js',
    spawn = Npm.require('child_process').spawn,
    args = [];

args.push(jasmineCli);

args.push('--coffee');
args.push('--color');

args.push('--junitreport');
args.push('--output');
args.push(process.env.PWD + '/tests/.rtd-unit-report');

args.push(process.env.PWD + '/packages/rtd-unit/lib');
args.push(process.env.PWD + '/tests');
jasmineNode = spawn('/usr/local/bin/node', args);

var regurgitate = function (data) {
    // TODO this should to to a test-runner visible console
    console.log(data.toString());
};
jasmineNode.stdout.on('data', regurgitate);
jasmineNode.stderr.on('data', regurgitate);

jasmineNode.on('close', function (code) {
    // TODO collect junit test reports and load them into the collection
});
