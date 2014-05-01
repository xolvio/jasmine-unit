Package.describe({
    summary: "RTD Unit - A Framework that runs in Meteor Test Runner"
});

Npm.depends({
    'glob': '3.2.9',
    'jasmine-node': '1.14.3'
});

Package.on_use(function (api) {
    api.add_files('main.js', ['server']);
});