# Spring Cloud Data Flow Dashboard [![Stories in Ready](https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=ready&title=Ready)](http://waffle.io/spring-cloud/spring-cloud-dataflow-ui) [![Stories in Progress](https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=In%20Progress&title=In%20Progress)](http://waffle.io/spring-cloud/spring-cloud-dataflow-ui)

|               | Build Status    |
| ------------- | :-------------: |
| Linux         | [![Build Status](http://build.spring.io/plugins/servlet/buildStatusImage/SCD-UILINUX)](https://build.spring.io/browse/SCD-UILINUX)  |
| Windows       | [![Build Status](http://build.spring.io/plugins/servlet/buildStatusImage/SCD-UIWIN)](https://build.spring.io/browse/SCD-UIWIN)  |


This is the *Spring Cloud Data Flow UI*. The UI uses [AngularJS][]. In order to provide nested view support, we use [AngularUI Router][]. For E2E Testing [Protractor][] is used.

| The Git repository for the main *Spring Cloud Data Flow* project is at: https://github.com/spring-cloud/spring-cloud-dataflow

# Building the Module

Two build tool chains are supported. Primarily, the *Spring Cloud Data Flow UI* uses [Grunt][] ([Node.js][]-based) and [Bower][] for managing dependencies and the execution of the build. In order to provide easier Continuous Integration support, [Maven][] can also be used to execute the build.

The *Spring Cloud Data Flow UI* uses [Maven][], specifically the [grunt-maven-plugin][] which will actually execute [Grunt][] and [Bower][] underneath. Using the [grunt-maven-plugin][], however, the required tooling will be downloaded, installed and executed for you.

## Requirements

Using [Maven][] is also the easiest route for Java developers to get started, as the only requirements are:

* [Maven][]
* Git

## Building the Project using Maven

	$ git clone https://github.com/spring-cloud/spring-cloud-dataflow-ui.git
	$ cd spring-cloud-dataflow-ui
	$ mvn clean package install

This will create `target/spring-cloud-dataflow-ui-1.0.0.BUILD-SNAPSHOT.jar` and also install the build artifact into the local Maven repository.

## Building the Project using Grunt

For UI development purposes, we recommend using [Grunt][] and [Bower][] directly. Please ensure that at a minimum [Node.js][] and [npm][] are available on your system. In order to execute the build simply do:

	$ git clone https://github.com/spring-cloud/spring-cloud-dataflow-ui.git
	$ cd spring-cloud-dataflow-ui/ui
	$ npm install
	$ grunt

This will invoke the default [Grunt][] task. The default task is equivalent of executing:

	$ grunt build

## Important Build-related Configuration Files

* **pom.xml** Maven config file
* ui/**package.json** Node dependencies
* ui/**bower.json** Bower dependencies
* ui/**Gruntfile.js** Grunt build file

# Running Tests

## Unit Tests

	$ grunt test:unit

## E2E Tests

In order to also execute the End-to-End (E2E) tests, please execute the UI build using:

	$ grunt test:e2e

If you are executing the E2E tests for the first time, you may have to execute:

	node node_modules/protractor/bin/webdriver-manager update

If you have already the UI running using:

	$grunt serve

you can also run the E2E tests separately using:

	$ grunt protractor:run

Please ensure that a Spring Cloud Data Flow server instance is running at `http://localhost:9393/`.

### Protractor

End-to-End tests are executed using [Protractor][]. By default we use [ChromeDriver][].

| **Note**: Chrome Driver "expects you to have Chrome installed in the default location for each system", e.g. for Mac it is: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`. For further details, please see: https://code.google.com/p/selenium/wiki/ChromeDriver

Please be also aware of the following [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner) plugin issue: https://github.com/teerapap/grunt-protractor-runner/issues/45

For example, you may encounter an issue such as the following:

````
Starting Protractor...
.
-------------------------------------------------------------------

/usr/local/share/npm/lib/node_modules/protractor/lib/driverProviders/local.js:42
        throw new Error('Could not find chromedriver at ' +
              ^
Error: Could not find chromedriver at /usr/local/share/npm/lib/node_modules/protractor/selenium/chromedriver.exe
    at LocalDriverProvider.addDefaultBinaryLocs_ (/usr/local/share/npm/lib/node_modules/protractor/lib/driverProviders/local.js:42:15)
...
````

Therefore, when running E2E tests, you may need to execute first: `./node_modules/protractor/bin/webdriver-manager update`.
Please pay also special attention whether you're using a **local** or global **global** protractor instance.

In order to improve the situation we may consider adding a special Grunt task for that as illustrated here: http://gitelephant.cypresslab.net/angular-js/commit/2ed4ad55022f6e5519617a3797649fe1e68f3734

You should now be able to execute the E2E tests using grunt:

	$ grunt test:e2e

You should be able to see console output similar to the following:

```
Started connect web server on http://0.0.0.0:8000

Running "protractor:run" (protractor) task
Starting selenium standalone server...
Selenium standalone server started at http://10.0.1.4:60164/wd/hub
.....................................

Finished in 42.012 seconds
37 tests, 55 assertions, 0 failures

Shutting down selenium standalone server.

Done, without errors.


Execution Time (2014-06-10 13:59:50 UTC)
concurrent:server     3s  ▇▇▇▇▇▇▇ 6%
protractor:run     49.2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 94%
Total 52.2s
```

### Protractor in Debug Mode

During development you may want to run E2E tests while working on the UI portions of the application. For this purpose you can use the provided script `e2e-test.sh` to run the E2E tests against a running Admin UI instance. As a requirement you need to have running:

* Admin UI Server
* Admin UI started from the console using `grunt serve`

You may also need to install `protractor` using

	$ npm install -g protractor

To execute the E2E tests, execute `./e2e-test.sh` via the console and all E2E tests should run.
`
This option also allows you to run Protractor in `debug` mode, allowing you to pause the execution of individual tests. For this to happen, execute:

	$ ./e2e-test.sh debug

You should see the following console output:

```
Starting Protractor...
.
-------------------------------------------------------------------
Starting selenium standalone server...
Hit SIGUSR1 - starting debugger agent.
debugger listening on port 5858
connecting... ok
break in timers.js:77
  75 }
  76
  77 function listOnTimeout() {
  78   var msecs = this.msecs;
  79   var list = this;
debug>
```

Please press `c` to continue with the execution. All E2E tests should now execute. In order to set 'breakpoints', add `browser.debugger();` at the appropriate places within your E2E tests. Fur further information see: https://github.com/angular/protractor/blob/master/docs/debugging.md.

## Development

For development, just run:

	$ grunt serve

The local browser window should open automatically. Please ensure that a Spring Cloud Data Flow server instance is running at `http://localhost:9393/`. The browser will automatically reload upon saving any changes to the application sources.

## Dependency Management using Bower

[Bower][] is used for managing UI dependencies.

### Search for dependencies:

The following command will search for a dependency called `angular-ui-router`.

	$ bower search angular-ui-router

### Install Bower dependency

Install that dependency and save it to `bower.json`:

	$ bower install angular-ui-router --save

Inject your dependencies into your `index.html` file:

	$ grunt bower-install

### Install Build Dependency

	$ npm install --save-dev grunt-contrib-less

## How to Update Node.js dependencies in package.json

Use [https://github.com/tjunnone/npm-check-updates](https://github.com/tjunnone/npm-check-updates)

[AngularJS]: http://angularjs.org/
[AngularJS generator]: https://github.com/yeoman/generator-angular
[Yeoman]: http://yeoman.io/
[ngRoute]: http://docs.angularjs.org/api/ngRoute
[AngularUI Router]: https://github.com/angular-ui/ui-router
[Gradle]: http://www.gradle.org/
[Grunt]: http://gruntjs.com/
[grunt-maven-plugin]: https://github.com/allegro/grunt-maven-plugin
[Bower]: http://bower.io/
[Maven]: http://maven.apache.org/
[Node.js]: http://nodejs.org/
[npm]: https://www.npmjs.com/
[Protractor]: https://github.com/angular/protractor
[ChromeDriver]: https://code.google.com/p/selenium/wiki/ChromeDriver

