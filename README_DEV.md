
<h1 align="center">
  Spring Data Flow Dashboard<br />
  Developer Guideline
</h1>

<p align="center">
  <a href="https://waffle.io/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=ready&title=Ready"
         alt="Stories in Ready">
  </a>
  <a href="https://waffle.io/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://badge.waffle.io/spring-cloud/spring-cloud-dataflow-ui.svg?label=In%20Progress&title=In%20Progress"
         alt="Stories in Progress">
  </a>
  <br />
  <a href="https://travis-ci.org/spring-cloud/spring-cloud-dataflow-ui">
    <img src="https://travis-ci.org/spring-cloud/spring-cloud-dataflow-ui.png?branch=master"
         alt="Build Status">
  </a>
  <a href="https://ci.appveyor.com/project/ghillert/spring-cloud-dataflow-ui/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/7pqco2aqjyaphp36/branch/master?svg=true"
         alt="Build status">
  </a>
  <a href="https://codecov.io/gh/spring-cloud/spring-cloud-dataflow-ui/branch/master">
    <img src="https://codecov.io/gh/spring-cloud/spring-cloud-dataflow-ui/branch/master/graph/badge.svg"
         alt="Code Coverage">
  </a>
  <a href="https://saucelabs.com/u/ghillert">
    <img src="https://saucelabs.com/buildstatus/ghillert"
         alt="Sauce Test Status">
  </a>
  <a href="https://www.browserstack.com/automate/public-build/T3pKbzdQK2RpVnkxZ2ZwN2tjeGFUSzdOQUJ2cG1GSDBYSlRvT00zZWV1bz0tLVpuMXk0eTJmN01ienhnbkNPbXJTanc9PQ==--b187f26b476b4d3f262b837e13f4be593c41e44c">
    <img src="https://www.browserstack.com/automate/badge.svg?badge_key=T3pKbzdQK2RpVnkxZ2ZwN2tjeGFUSzdOQUJ2cG1GSDBYSlRvT00zZWV1bz0tLVpuMXk0eTJmN01ienhnbkNPbXJTanc9PQ==--b187f26b476b4d3f262b837e13f4be593c41e44c"
         alt="BrowserStack Status">
  </a>
</p>

<p align="center">
  <a href="#build">Development</a> •
  <a href="#development">SauceLabs / BrowserStack</a>
</p>

## Development

### Run the project

As a developer, you have to build **the project using npm** (`ui/` folder).

The following commands are available:

```bash
# Run the project
$ npm start

# Run the unit tests
$ ng test --single-run

# Run lint
$ ng lint

# Run the e2e tests
$ npm run e2e

# Produces code coverage report
$ ng test --watch --code-coverage  --reporters=coverage-istanbul
```

You can also run the tests on **SauceLabs** or on **BrowserStack**:

```bash
# Run the unit tests on SauceLabs
$ npm run test-saucelabs-local

# Run the e2e tests on SauceLabs
$ npm run e2e-saucelabs-local

# Run the test on BrowserStack
$ npm run test-browserstack-local

# Run the test on BrowserStack
$ npm run e2e-browserstack-local
```

⚠️ **E2E Tests**

When executing E2E tests you can either run a local Docker environment using the Spring Cloud Data Flow provided [Docker Compose yaml file](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/docker-compose.yml) or, alternatively, have Protractor bootstrap Docker for you (Docker needs to be running and the [Docker Compose](https://docs.docker.com/compose/) command needs to be available in the path).

When using Docker Compose manually, set the environment variable `DATAFLOW_SKIP_DOCKER_COMPOSE` to `true`. For both options you also need to specify the respective Docker version tags for [Spring Cloud Data Flow](https://hub.docker.com/r/springcloud/spring-cloud-dataflow-server/tags) and [Spring Cloud Skipper](https://hub.docker.com/r/springcloud/spring-cloud-skipper-server/tags) using the environment variables:

- `DATAFLOW_VERSION`
- `SKIPPER_VERSION`

### Build fails after merging a branch or changing branches

In some cases the npm-modules or other dependencies may become inconsistent during branch changes.
In order to resolve the problem we need to clean out inconsistent dependencies.
The following instructions can be used to do this:

* Shutdown the development server if it is running.
* Commit or stash your changes
* Execute the following:
	* `git clean -fx`
	* `npm install`
* If you stashed your files execute the following:  `git stash pop`
* Now build the application by executing the following: `ng build --prod`

## SauceLabs / BrowserStack

### Setup SauceLabs

Before you can run tests using **SauceLabs**, please setup your username and password.

For E2E tests, developers should refrain from using `localhost`. Instead, add `dataflow.local` to your local DNS hosts file.

```bash
$ export SAUCE_USERNAME=your-username
$ export SAUCE_ACCESS_KEY=your-access-key
```

⚠️ **Slow Internet Connection**

By default the tests use an embedded version of Sauce Connect. In case you enounter test failures due to bandwidth constraints,
you may consider establishing a SauceLabs tunnel using the stand-alone [Sauce Connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy).

Setup instructions for Sauce Connect can be found [here](https://wiki.saucelabs.com/display/DOCS/Basic+Sauce+Connect+Proxy+Setup). Use the following environment variables:

```bash
$ export SAUCE_CONNECT_USE_EMBEDDED=false
$ export SAUCE_USER=your-sauce-user
$ export SAUCE_API_KEY=your-sauce-key
```

### Setup BrowserStack

Before you can run tests using **BrowserStack**, please setup your username and password:

```bash
$ export BROWSER_STACK_USERNAME=your-username
$ export BROWSER_STACK_ACCESS_KEY=your-access-key
```
