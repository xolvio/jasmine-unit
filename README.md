# Jasmine-Unit


## Usage

1. Add the `jasmine-unit` package
    ```bash
    $ mrt add jasmine-unit
    ```

2. Add tests
Add tests to a `tests` dir in your app's root.  Test files should follow
this naming convention: "<test name>-jasmine-unit.js"

Ex. "myapp/tests/some-feature-jasmine-unit.js"


3. Add stubs, if needed

4. Run app

    ```bash
    $ mrt
    ```

   For full debug output:
   ```bash
   $ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 mrt
   ```


## Stubs

Jasmine-unit runs your unit tests outside the Meteor context.  This means that 
your test code is isolated and only testing the things you want them to.  But
code within your app that expects Meteor to be there won't run properly.

This is fixed by creating 'stubs' for the expected objects.

Jasmine-unit does two things to make this easier for you:

* Includes the [meteor-stubs](https://github.com/alanning/meteor-stubs) npm package which covers all the core Meteor objects
* Includes the [package-stubber](http://atmospherejs.com/package/package-stubber) smart package which attempts to stub any packages used in your app


Auto-stubbing can help save you time but there will be cases where you'll have 
to make your own custom stubs.  To add your own stubs, add them to your app's
`tests` directory like so:

```
myapp/tests/foo-stub.js
myapp/tests/even-more-stubs.js
```

These files will be automatically loaded before your main app code.


## Docs

API docs generated using [YUIDoc](http://yui.github.com/yuidoc/).

To view documentation locally:

```bash
$ npm -g install yuidocjs
$ git clone https://github.com/xolvio/jasmine-unit.git
$ cd jasmine-unit
$ yuidoc --server
$ open http://localhost:3000/
```
