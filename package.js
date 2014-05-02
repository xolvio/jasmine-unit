Package.describe({
    summary: "RTD Unit - A test framework that runs in Velocity"
});

Npm.depends({
    'glob': '3.2.9',
    "lodash": "2.4.1",
    'xml2js': '0.4.2',
    'jasmine-node': '1.14.3'
});

Package.on_use(function (api) {
    api.use(['velocity']);
    api.add_files('main.js', ['server']);
});
