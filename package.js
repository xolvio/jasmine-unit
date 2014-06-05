Package.describe({
    summary: "Velocity Jasmine-Unit - A test framework that runs in Velocity"
});

Npm.depends({
    'glob': '3.2.9',
    'lodash': '2.4.1',
    'rimraf': '2.2.8',
    'xml2js': '0.4.2',
    'jasmine-node': '1.14.3',
    'coffee-script': '1.7.1',
    'meteor-stubs': '0.0.1'
});

Package.on_use(function (api) {
    api.use('velocity');
    api.add_files('main.js', 'server');
});
