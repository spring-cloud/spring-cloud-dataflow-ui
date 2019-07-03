// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {

  const BS_COMMON_CONFIG = {
    base: 'BrowserStack'
  };

  const customLaunchers = {
    'BS_Mac_OS_HighSierra_Safari_11': Object.assign({
      'os'              : 'OS X',
      'os_version'      : 'High Sierra',
      'browser'         : 'Safari',
      'browser_version' : '11.1'
    }, BS_COMMON_CONFIG),
    'BS_Mac_OS_HighSierra_Chrome_75': Object.assign({
      'os'              : 'OS X',
      'os_version'      : 'High Sierra',
      'browser'         : 'Chrome',
      'browser_version' : '75.0'
    }, BS_COMMON_CONFIG),
    'BS_Mac_OS_HighSierra_Firefox_67': Object.assign({
      'os'              : 'OS X',
      'os_version'      : 'High Sierra',
      'browser'         : 'Firefox',
      'browser_version' : '67.0'
    }, BS_COMMON_CONFIG),
    'BS_Windows_10_Firefox_67': Object.assign({
      'os'              : 'Windows',
      'os_version'      : '10',
      'browser'         : 'Firefox',
      'browser_version' : '67.0'
    }, BS_COMMON_CONFIG),
    'BS_Windows_10_Edge_18': Object.assign({
      'os'              : 'Windows',
      'os_version'      : '10',
      'browser'         : 'Edge',
      'browser_version' : '18.0'
    }, BS_COMMON_CONFIG),
    'BS_Windows_10_Chrome_75': Object.assign({
      'os'              : 'Windows',
      'os_version'      : '10',
      'browser'         : 'Chrome',
      'browser_version' : '75.0'
    }, BS_COMMON_CONFIG)
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
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true
    },
    angularCli: {
      environment: 'dev'
    },
    browserStack: {
      name: 'Data Flow Dashboard Unit Tests',
      project: 'Data_Flow'
    },

    concurrency: 1,
    retryLimit: 4,
    browserDisconnectTimeout: 240*1000,   // default 2000
    browserDisconnectTolerance: 0,        // default 0
    browserNoActivityTimeout: 240*1000,   // default 10000
    captureTimeout: 240*1000,             // default 60000

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    reporters: ['dots', 'BrowserStack'],
    colors: true,
    logLevel: config.LOG_WARN,
    browserConsoleLogOptions: {
      level: 'warn',
      format: '%b %T: %m',
      terminal: true
    }
  });
};
