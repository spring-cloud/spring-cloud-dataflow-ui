// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  plugins: [
    {
      path: '../protractor-docker-plugin/index.js',
      dockerComposeUri: 'https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/docker-compose.yml',
      useCachedoDockerComposeFile: true,
      dockerComposeWaitTime: 512000
    }
  ],
  allScriptsTimeout: 110000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=800,600', '--no-sandbox']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
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
