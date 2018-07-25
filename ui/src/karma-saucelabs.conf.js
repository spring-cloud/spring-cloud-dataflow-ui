// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {

  const customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '64.0',
      'chromedriverVersion':'2.35',
      timeout: 360,
      idleTimeout: 5000,
      maxDuration: 1800,
      commandTimeout: 600
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-sauce-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'dev'
    },
    sauceLabs: {
      testName: 'Data Flow Dashboard Unit Tests'
    },
    captureTimeout: 1000000,
    browserDisconnectTimeout: 1000000,
    concurrency: 1,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    reporters: ['progress', 'saucelabs'],
    colors: true,
    logLevel: config.LOG_DEBUG,
    browserNoActivityTimeout: 1000000
  });
};
