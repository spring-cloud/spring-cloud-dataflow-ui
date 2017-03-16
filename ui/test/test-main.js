var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/i.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  // The number of seconds to wait before giving up on loading a script.
  // Setting it to 0 disables the timeout. The default is 7 seconds.
  waitSeconds: 60,
  paths: {
    model:   'shared/model',
    jquery: '/base/app/lib/jquery/jquery',
    angular: '/base/app/lib/angular/angular',
    angularRoute: '/base/app/lib/angular-route/angular-route',
    angularMocks: '/base/app/lib/angular-mocks/angular-mocks',
    ngResource: '/base/app/lib/angular-resource/angular-resource',
    clipboard: '/base/app/lib/clipboard/clipboard',
    ngclipboard: '/base/app/lib/ngclipboard/ngclipboard',
    text: '/base/app/lib/requirejs-text/text',
    fixtures: '/base/app/test/spec/fixtures',
    angularHighlightjs: '/base/app/lib/angular-highlightjs/angular-highlightjs',
    highlightjs: '/base/app/lib/highlightjs/highlight.pack',
    uiRouter: '/base/app/lib/angular-ui-router/angular-ui-router',
    cgBusy: '/base/app/lib/angular-busy/angular-busy',
    ngGrowl: '/base/app/lib/angular-growl-v2/angular-growl',
    ngAnimate: '/base/app/lib/angular-animate/angular-animate',
    xregexp: '/base/app/lib/xregexp/xregexp-all',
    moment: '/base/app/lib/moment/moment',
    pagination: '/base/app/lib/angular-utils-pagination/dirPagination',
    ngCharts: '/base/app/lib/angular-google-chart/ng-google-chart',
    ngBootstrap: '/base/app/lib/angular-bootstrap/ui-bootstrap-tpls',
    ngIndeterminate: '/base/app/lib/angular-ui-indeterminate/indeterminate',
    ngCookies: '/base/app/lib/angular-cookies/angular-cookies',
    d3: '/base/app/lib/d3/d3',

    joint: '/base/app/lib/joint/joint',
    backbone: '/base/app/lib/backbone/backbone',
    lodash: '/base/app/lib/lodash/lodash.compat',

    flo: '/base/app/lib/spring-flo/spring-flo'

  },
  map: {
    '*': {
      // Backbone requires underscore. This forces requireJS to load lodash instead:
      'underscore': 'lodash'
    }
  },
  baseUrl: '/base/app/scripts',
  shim: {
    'angular' : {'exports' : 'angular'},
    'angularRoute': ['angular'],
    'angularMocks': {
      deps:['angular'],
      'exports':'angular.mock'
    },
    'uiRouter': {
       deps: ['angular']
    },
    cgBusy: {
      deps: ['angular']
    },
    'ngClipboard': {
      deps: ['clipboard', 'angular']
    },
    'angularHighlightjs': {
      deps: ['angular', 'highlightjs']
    },
    'ngResource': {
      deps: ['angular']
    },
    'pagination': {
      deps: ['angular']
    },
    'ngAnimate': {
        deps: ['angular']
    },
    'ngGrowl': {
      deps: ['angular', 'ngAnimate']
    },
    'ngCharts': {
      deps: ['angular']
    },
    'ngBootstrap': {
      deps: ['angular']
    },
    'ngIndeterminate': {
      deps: ['angular']
    },
    'ngCookies': {
      deps: ['angular']
    },
    backbone: {
      deps: ['underscore', 'jquery']
    },
	'underscore': {
	    exports: '_'
	},
    joint: {
      deps: ['jquery', 'underscore', 'backbone']
    },
    'flo': {
    	deps: ['angular', 'jquery', 'joint', 'underscore']
    },
  },
  deps: tests,
  callback: window.__karma__.start
});

