# Jasmine-Unit

A [velocity](https://github.com/xolvio/velocity/)-compatible test framework which enables easy unit testing of [Meteor](https://www.meteor.com/) apps using the [jasmine](http://jasmine.github.io/) syntax.

To use jasmine syntax for integration-style tests which run in the Meteor context, please see the [`jasmine`](https://github.com/Sanjo/meteor-jasmine) test framework.


### Meteor 0.9+ support

A lot of the internals that `jasmine-unit` depends on have changed with the release of the new packaging system in Meteor 0.9.  This `jasmine-unit` package will therefore stay pre-0.9 only and development will continue in the `jasmine` package which will support both integration and unit testing.

There is a working version of the `jasmine` package with support for server-side unit tests and the new package system; at the time of writing its still pre-release so there may be rough edges.  You can see a working example here:  https://github.com/meteor-velocity/velocity-example/tree/jasmine-only

To try it out, clone the repo locally and then run `mrt install` to update the dependencies.

Check the [`smart.json`](https://github.com/meteor-velocity/velocity-example/blob/jasmine-only/smart.json) file for an example of how to use the pre-release package in your own app.

### Migrating from `jasmine-unit` to `jasmine`

There are a few differences between the `jasmine` package and `jasmine-unit`:


  1. `jasmine` uses jasmine 2.0.  Please see the [upgrading to jasmine 2.0](http://jasmine.github.io/2.0/upgrading.html) document for how to modify your unit tests (mostly spies)
  2. test location - server-side unit tests are now located in the `tests/jasmine/server/unit` directory
  3. no client-side unit testing.  The `jasmine` package currently does not support client-side unit tests (but does support client-side integration tests).  If this is important to you, please consider helping out by contributing a Pull Request.


### Quick-start

To get up and running quickly, you may want to use the [`velocity-quick-start`](https://github.com/alanning/meteor-velocity-quick-start) which includes the `velocity-html-reporter` and sample tests for several test frameworks, including `jasmine-unit`.

Here's how to add it to an existing project.  See the repo for more step-by-step instructions.

```sh
$ cd ~/tmp
$ meteor create --example leaderboard
$ cd leaderboard
$ mrt add velocity-quick-start
$ meteor
```

If you would like to see debug output for all the test frameworks, run this command instead:

```sh
$ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 meteor
```



### Installation

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


### Usage


1. Add tests
    
    Add tests to a `tests` dir in your app's root.  Test files should follow
    this naming convention: "<test name>-jasmine-unit.js"
    
    Ex. "myapp/tests/some-feature-jasmine-unit.js"
    
    ```bash
    $ mkdir tests
    $ cp packages/jasmine-unit/sample-tests/examples-jasmine-unit.js tests
    ```
    
2. Add stubs, if needed (see below)

3. (Optional) Add [velocity-html-reporter](https://github.com/rdickert/velocity-html-reporter/)

    Test results will be output to the console by default but if you would like to have a nice looking
    display in your application, you can install this optional package.
    
    ```bash
    $ mrt add velocity-html-reporter
    ```

4. Run app

    ```bash
    $ meteor
    ```

   For full debug output:
   ```bash
   $ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 meteor
   ```

5. View app in browser

    ```bash
    $ open http://localhost:3000/
    ```
    

### Stubs

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


### Docs

API docs generated using [YUIDoc](http://yui.github.com/yuidoc/).

To view documentation locally:

```bash
$ npm -g install yuidocjs
$ git clone https://github.com/xolvio/jasmine-unit.git
$ cd jasmine-unit
$ yuidoc --server
$ open http://localhost:3000/
```
