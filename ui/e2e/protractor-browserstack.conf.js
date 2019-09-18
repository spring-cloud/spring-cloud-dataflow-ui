// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');

exports.config = {
  jasmineNodeOpts: {
    defaultTimeoutInterval: 50000000
  },
  seleniumAddress: 'https://hub-cloud.browserstack.com/wd/hub',
  commonCapabilities: {
    name: 'Data Flow Dashboard E2E Tests',  
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key':  process.env.BROWSER_STACK_ACCESS_KEY,
    'browserstack.local': true,
    'browserstack.debug': true,
    'browserstack.idleTimeout': 512
  },
  plugins: [
    {
      path: '../protractor-docker-plugin/index.js',
      dockerComposeUri: 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/docker-compose.yml',
      useCachedoDockerComposeFile: true,
      dockerComposeWaitTime: 512000
    }
  ],
  multiCapabilities: [
    {
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '77.0',
      resolution: '1024x768'
    }
    // {
    //   os: 'Windows',
    //   os_version: '10',
    //   browserName: 'Edge',
    //   browser_version: '16.0'
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
  // Code to start browserstack local before start of test
  beforeLaunch: function(){
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.commonCapabilities['browserstack.key'] }, function(error) {
        if (error) {
          console.log('Error:', error);
          return reject(error);
        }
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function() {
    return new Promise(function(resolve, reject){
      exports.bs_local.stop(resolve);
    });
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
