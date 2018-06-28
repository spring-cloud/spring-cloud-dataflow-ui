// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {

  const customLaunchers = {
    'bs_chrome': {
      base: 'BrowserStack',
      'os' : 'OS X',
      'os_version' : 'High Sierra',
      'browser' : 'Safari',
      'browser_version' : '11.1'
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-browserstack-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'dev'
    },
    browserStack: {
      name: 'Data Flow Dashboard Unit Tests'
    },
    captureTimeout: 120000,
    retryLimit: 10,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,

    reporters: ['progress', 'BrowserStack'],
    colors: true,
    logLevel: config.LOG_DEBUG,
    browserNoActivityTimeout: 1000000
  });
};
