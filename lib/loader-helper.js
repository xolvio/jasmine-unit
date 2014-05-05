var PWD = process.env.PWD,
    glob = require(PWD + '/packages/rtd-unit/.npm/package/node_modules/glob'),
    coffeeRequire = require(PWD + '/packages/rtd-unit/lib/coffee-require');

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

getTemplates = function () {
    // TODO scan all html files and extract template names
    return ['leaderboard', 'player'];
};
for (i in getTemplates()) {
    Template.stub(getTemplates()[i]);
}

// TODO mimic the Meteor loading order behaviour here
//require(PWD + '/leaderboard.js');
coffeeRequire(PWD + '/leaderboard.coffee');