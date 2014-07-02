# Jasmine-Unit

A [velocity](https://github.com/xolvio/velocity/)-compatible test framework which enables easy testing of [Meteor](https://www.meteor.com/) apps using the [jasmine](http://jasmine.github.io/) syntax.


## Usage

1. Install [nodejs](http://nodejs.org/)
2. Install [meteor](https://www.meteor.com/)

    ```bash
    $ curl https://install.meteor.com/ | sh
    ```

3. Install [meteorite](https://github.com/oortcloud/meteorite/)

    ```bash
    $ sudo -H npm install -g meteorite
    ```

4. Create a Meteor app

    ```bash
    $ cd ~/tmp
    $ meteor create --example leaderboard
    $ cd leaderboard
    ```
5. Add the `jasmine-unit` package to existing Meteor app

    ```bash
    $ mrt add jasmine-unit
    ```

6. Add tests
    
    Add tests to a `tests` dir in your app's root.  Test files should follow
    this naming convention: "<test name>-jasmine-unit.js"
    
    Ex. "myapp/tests/some-feature-jasmine-unit.js"
    
    ```bash
    $ mkdir tests
    $ cp packages/jasmine-unit/SampleTests/examples-jasmine-unit.js tests
    ```
    
7. Add stubs, if needed (see below)

8. (Optional) Add [velocity-html-reporter](https://github.com/rdickert/velocity-html-reporter/)

    Test results will be output to the console by default but if you would like to have a nice looking
    display in your application, you can install this optional package.
    
    ```bash
    $ mrt add velocity-html-reporter
    ```

9. Run app

    ```bash
    $ mrt
    ```

   For full debug output:
   ```bash
   $ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 mrt
   ```

10. View app in browser

    ```bash
    $ open http://localhost:3000/
    ```
    

## Stubs

Jasmine-unit runs your unit tests outside the Meteor context.  This means that 
your test code is fast, isolated, and only testing the things you want them to.  But
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

Package-stubber also provides some manually created stubs for common packages so if you do make stubs, consider contributing them back to the [package-stubber project repo](https://github.com/alanning/meteor-package-stubber/tree/master/package-stubber) so that others can use them as well.


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
