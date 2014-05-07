Package.describe({
    summary: "Velocity Jasmine-Unit - A test framework that runs in Velocity"
});

Npm.depends({
    'glob': '3.2.9',
    "lodash": "2.4.1",
    'xml2js': '0.4.2',
    'jasmine-node': '1.14.3',
    'karma': '0.11.14',
    'karma-coffee-preprocessor': '0.2.1',
    'better-require' : '0.0.3'
});

Package.on_use(function (api) {
    api.use(['velocity']);
    api.add_files('main.js', ['server']);
});
