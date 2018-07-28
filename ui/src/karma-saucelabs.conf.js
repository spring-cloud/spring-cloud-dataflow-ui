// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {

  const useEmbeddedSauceConnect =
  (process.env.SAUCE_CONNECT_USE_EMBEDDED && process.env.SAUCE_CONNECT_USE_EMBEDDED === 'false') ? false : true;
  console.log('Use embedded Sauce Connect client?: ' + useEmbeddedSauceConnect);

  const SL_COMMON_CONFIG = {
    base: 'SauceLabs',
    maxDuration: 30 * 60,
    commandTimeout: 10 * 60,
    idleTimeout: 10 * 60,
  };

  const customLaunchers = {
    'SL_Windows_10_Edge_16': Object.assign({
      browserName : 'MicrosoftEdge',
      version     : '16.16299',
      platform    : 'Windows 10'
    }, SL_COMMON_CONFIG),
    'SL_Windows_10_Chrome_67': Object.assign({
      browserName : 'chrome',
      version     : '67.0',
      platform    : 'Windows 10'
    }, SL_COMMON_CONFIG),
    'SL_Windows_10_Firefox_59': Object.assign({
      browserName : 'firefox',
      version     : '59.0',
      platform    : 'Windows 10'
    }, SL_COMMON_CONFIG),
    'SL_Mac_OS_HighSierra_Safari_11': Object.assign({
      browserName : 'safari',
      version     : '11.1',
      platform    : 'macOS 10.13'
    }, SL_COMMON_CONFIG),
    'SL_Mac_OS_HighSierra_Chrome_67': Object.assign({
      browserName : 'chrome',
      version     : '67.0',
      platform    : 'macOS 10.13'
    }, SL_COMMON_CONFIG),
    'SL_Mac_OS_HighSierra_Firefox_59': Object.assign({
      browserName : 'firefox',
      version     : '59.0',
      platform    : 'macOS 10.13'
    }, SL_COMMON_CONFIG)
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
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true
    },
    angularCli: {
      environment: 'dev'
    },
    sauceLabs: {
      testName: 'Data Flow Dashboard Unit Tests',
      startConnect: useEmbeddedSauceConnect
    },
    captureTimeout: 1000000,
    browserDisconnectTimeout: 1000000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    reporters: ['dots', 'saucelabs'],
    colors: true,
    logLevel: config.LOG_WARN,
    browserNoActivityTimeout: 1000000,
    browserConsoleLogOptions: {
      level: 'warn',
      format: '%b %T: %m',
      terminal: true
    }
  });
};
