// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const useEmbeddedSauceConnect =
(process.env.SAUCE_CONNECT_USE_EMBEDDED && process.env.SAUCE_CONNECT_USE_EMBEDDED === 'false') ? false : true;
console.log('Use embedded Sauce Connect client?: ' + useEmbeddedSauceConnect);

exports.config = {

  jasmineNodeOpts: {
    defaultTimeoutInterval: 500000
  },
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  plugins: [
    {
      path: '../protractor-docker-plugin/index.js',
      dockerComposeUri: 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server-local/docker-compose.yml',
      useCachedoDockerComposeFile: true,
      dockerComposeWaitTime: 512000
    }
  ],
  multiCapabilities: [
    {
      name: 'E2E Chrome/Mac',
      browserName: 'chrome',
      version: '73.0',
      platform: 'Windows 10',
      idleTimeout: 512
    },
    {
      name: 'E2E Safari/Mac',
      browserName: 'safari',
      platform: 'macOS 10.13',
      idleTimeout: 512
    }
    // {
    //   name: 'E2E Edge/Win10',
    //   browserName: 'MicrosoftEdge',
    //   platform: 'Windows 10',
    //   idleTimeout: 512
    // }
  ],
  maxSessions: 1,
  allScriptsTimeout: 160000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  SELENIUM_PROMISE_MANAGER: false,
  directConnect: false,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  beforeLaunch: function() {
    const q = require('q');
    const deferred = q.defer(); 
    startSauceConnect(deferred);
    return deferred.promise;
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};

function startSauceConnect(deferred) {
  if (useEmbeddedSauceConnect) {
    var sauceConnectLauncher = require('sauce-connect-launcher');
    console.log('Launching Sauce Connect...')
    sauceConnectLauncher(
      {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        // verbose: true,
        // logger: console.log,
        //  tunnelIdentifier: 'npm-build',
        // doctor: false
      }, function (err, sauceConnectProcess) {
        if (err) {
          console.error('Error', err.message);
        }
        deferred.resolve();
        console.log("Sauce Connect ready");
        // sauceConnectProcess.close(function () {
        //   console.log("Closed Sauce Connect process");
        // })
      }
    );
  } else {
    deferred.resolve();
  }
};