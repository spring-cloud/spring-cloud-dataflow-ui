// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  jasmineNodeOpts: {
    defaultTimeoutInterval: 5000000
  },
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  multiCapabilities: [
    {
      name: 'E2E Safari/Mac',
      browserName: 'safari',
      platform: 'macOS 10.13',
    },
    {
      name: 'E2E Edge/Win10',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
    }
  ],

  allScriptsTimeout: 160000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
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
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};

function startSauceConnect(deferred) {
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
};