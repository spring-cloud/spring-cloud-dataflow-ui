/*
 * Copyright 2013-2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Dashboard Routes configuration
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define(['./app'], function (dashboard) {
  'use strict';
  dashboard.config(function ($stateProvider, $urlRouterProvider, $httpProvider, hljsServiceProvider, growlProvider, $animateProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpErrorInterceptor');
    $urlRouterProvider.otherwise('/apps/apps');

    hljsServiceProvider.setOptions({
      tabReplace: '  '
    });

    growlProvider.globalTimeToLive(5000);

    //Let's make sure ngAnimate is not triggered for certain CSS classes
    $animateProvider.classNameFilter(/^((?!(myspinner)).)*$/);

    var jobTemplatesPath = 'scripts/job/views',
        taskTemplatesPath = 'scripts/task/views',
        streamTemplatesPath = 'scripts/stream/views',
        authTemplatesPath = 'scripts/auth/views',
        featureTemplatePath = 'scripts/feature/views',
        sharedTemplatesPath = 'scripts/shared/views',
        runtimeTemplatesPath = 'scripts/runtime/views',
        analyticsTemplatesPath = 'scripts/analytics/views',
        appTemplatesPath = 'scripts/app/views';

    $stateProvider.state('home', {
      url : '/',
      abstract:true,
      templateUrl : sharedTemplatesPath + '/home.html'
    })
    .state('home.tasks', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'tasksEnabled'
      }
    })
    .state('home.analytics', {
      abstract: true,
      template: '<ui-view/>',
      data: {
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'analyticsEnabled'
      }
    })
    .state('home.apps', {
      abstract: true,
      template: '<ui-view/>',
      data: {
        authenticate: true,
        roles: ['ROLE_VIEW']
      }
    })
    .state('home.streams', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'streamsEnabled'
      }
    })
    .state('home.runtime', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true,
        roles: ['ROLE_VIEW']
      }
    })
    .state('home.jobs.tabs', {
      url : 'jobs',
      abstract:true,
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      },
      templateUrl : jobTemplatesPath + '/jobs.html'
    })
    .state('home.tasks.tabs', {
      url : 'tasks',
      abstract:true,
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      },
      templateUrl : taskTemplatesPath + '/tasks.html'
    })
    .state('home.about', {
      url : 'about',
      controller: 'AboutController',
      templateUrl : sharedTemplatesPath + '/about.html',
      data:{
        authenticate: false
      }
    })
    .state('login', {
      url : '/login',
      controller: 'LoginController',
      templateUrl : authTemplatesPath + '/login.html',
      data:{
        authenticate: false
      }
    })
    .state('logout', {
      url : '/logout',
      controller: 'LogoutController',
      data:{
        authenticate: true
      }
    })
    .state('featureDisabled', {
      url : '/disabled/{feature}',
      controller: 'FeatureDisabledController',
      templateUrl : featureTemplatePath + '/disabled.html',
      data:{
        authenticate: false
      }
    })
    .state('home.rolesMissing', {
      url : '/roles-missing',
      templateUrl : sharedTemplatesPath + '/roles-missing.html',
      data:{
        authenticate: false
      }
    })
    .state('home.streams.tabs', {
      url : 'streams',
      abstract:true,
      data:{
        authenticate: true,
        feature: 'streamsEnabled'
      },
      templateUrl : streamTemplatesPath + '/streams.html'
    })
    .state('home.streams.tabs.definitions', {
      url : '/definitions',
      templateUrl : streamTemplatesPath + '/definitions.html',
      controller: 'StreamsDefinitionsController',
      data:{
        authenticate: true,
        feature: 'streamsEnabled'
      }
    })
    .state('home.streams.tabs.create', {
      url : '/create',
      templateUrl : streamTemplatesPath + '/create-stream.html',
      controller: 'StreamsCreationController',
      data:{
        authenticate: true,
        feature: 'streamsEnabled'
      }
    })
    .state('home.streams.deployStream', {
      url : 'streams/definitions/{definitionName}/deploy',
      templateUrl : streamTemplatesPath + '/definition-deploy.html',
      controller: 'DefinitionDeployController',
      data:{
        authenticate: true,
        feature: 'streamsEnabled'
      }
     })
    .state('home.streams.detailedStream', {
      url : 'streams/definitions/{streamName}',
      templateUrl : streamTemplatesPath + '/detailed-stream.html',
      controller: 'DetailedStreamController',
      data:{
        authenticate: true,
        feature: 'streamsEnabled'
      }
    })

    .state('home.jobs.tabs.definitions', {
      url : '/definitions',
      templateUrl : jobTemplatesPath + '/definitions.html',
      controller: 'JobDefinitionsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs.tabs.executions', {
      url : '/executions',
      templateUrl : jobTemplatesPath + '/executions.html',
      controller: 'JobExecutionsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs.executiondetails', {
      url : 'jobs/executions/{executionId}',
      templateUrl : jobTemplatesPath + '/execution-details.html',
      controller: 'JobExecutionDetailsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs.stepexecutiondetails', {
      url : 'jobs/executions/{executionId}/{stepExecutionId}',
      templateUrl : jobTemplatesPath + '/stepexecution-details.html',
      controller: 'StepExecutionDetailsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs.stepexecutionprogress', {
      url : 'jobs/executions/{executionId}/{stepExecutionId}/progress',
      templateUrl : jobTemplatesPath + '/stepexecution-progress.html',
      controller: 'StepExecutionProgressController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.jobs.deploymentsSchedule', {
      url : 'schedule/{jobName}',
      templateUrl : jobTemplatesPath + '/schedule.html',
      controller: 'JobScheduleController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.tasks.tabs.appsList', {
      url : '/apps',
      templateUrl : taskTemplatesPath + '/apps.html',
      controller: 'TaskAppsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.tasks.appdetails', {
      url : 'tasks/apps/{appName}',
      templateUrl : taskTemplatesPath + '/app-details.html',
      controller: 'AppDetailsController',
      data:{
        title: 'App Details',
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.tasks.appcreatedefinition', {
      url : 'tasks/apps/{appName}/create-definition',
      templateUrl : taskTemplatesPath + '/app-create-definition.html',
      controller: 'AppCreateDefinitionController',
      data:{
        title: 'App Create Definition',
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.tasks.tabs.definitions', {
      url : '/definitions',
      templateUrl : taskTemplatesPath + '/definitions.html',
      controller: 'TaskDefinitionsController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
    .state('home.tasks.bulkDefineTasks', {
      url : 'tasks/bulk-define-tasks',
      templateUrl : taskTemplatesPath + '/bulk-define-tasks.html',
      controller: 'BulkDefineTasksController',
      data:{
        authenticate: true,
        feature: 'tasksEnabled'
      }
    })
        .state('home.tasks.deploymentsLaunch', {
          url: 'tasks/definitions/launch/{taskName}',
          templateUrl: taskTemplatesPath + '/launch.html',
          controller: 'TaskLaunchController',
          data:{
            authenticate: true,
            feature: 'tasksEnabled'
          }
        })
        .state('home.tasks.tabs.executions', {
          url: '/executions',
          templateUrl: taskTemplatesPath + '/executions.html',
          controller: 'TaskExecutionsController',
          data:{
            authenticate: true,
            feature: 'tasksEnabled'
          }
        })
        .state('home.tasks.executiondetails', {
          url : 'tasks/executions/{executionId}',
          templateUrl : taskTemplatesPath + '/execution-details.html',
          controller: 'TaskExecutionDetailsController',
          data:{
            authenticate: true,
            feature: 'tasksEnabled'
          }
        })
        .state('home.analytics.tabs', {
          url: 'analytics',
          abstract: true,
          data: {
            authenticate: true,
            feature: 'analyticsEnabled'
          },
          templateUrl: analyticsTemplatesPath + '/analytics.html'
        })
        .state('home.analytics.tabs.dashboard', {
          url: '/dashboard',
          templateUrl: analyticsTemplatesPath + '/dashboard.html',
          controller: 'DashboardController',
          data: {
            title: 'Dashboard',
            authenticate: true,
            feature: 'analyticsEnabled'
          }
        })
        .state('home.analytics.tabs.counters', {
          url: '/counters',
          templateUrl: analyticsTemplatesPath + '/counters.html',
          controller: 'CountersController',
          data: {
            title: 'Counters',
            authenticate: true,
            feature: 'analyticsEnabled'
          }
        })
        .state('home.analytics.tabs.gauges', {
          url: '/gauges',
          templateUrl: analyticsTemplatesPath + '/gauges.html',
          controller: 'GaugesController',
          data: {
            title: 'Gauges',
            authenticate: true,
            feature: 'analyticsEnabled'
          }
        })
        .state('home.analytics.tabs.richgauges', {
          url: '/rich-gauges',
          templateUrl: analyticsTemplatesPath + '/rich-gauges.html',
          controller: 'RichGaugesController',
          data: {
            title: 'Rich-Gauges',
            authenticate: true,
            feature: 'analyticsEnabled'
          }
        })
        .state('home.apps.tabs', {
          url: 'apps',
          abstract: true,
          data: {
            authenticate: true
          },
          templateUrl: appTemplatesPath + '/apps.html'
        })
        .state('home.apps.tabs.appsList', {
          url: '/apps',
          templateUrl: appTemplatesPath + '/apps-list.html',
          controller: 'AppsController',
          data: {
            title: 'Apps',
            authenticate: true
          }
        })
        .state('home.apps.registerApps', {
          url: 'apps/register-apps',
          templateUrl: appTemplatesPath + '/register-apps.html',
          controller: 'RegisterAppsController',
          data: {
            title: 'Register Apps',
            authenticate: true
          }
        })
        .state('home.apps.bulkImportApps', {
          url: 'apps/bulk-import-apps',
          templateUrl: appTemplatesPath + '/bulk-import-apps.html',
          controller: 'BulkImportAppsController',
          data: {
            title: 'Bulk Import Apps',
            authenticate: true
          }
        })
        .state('home.runtime.tabs', {
          url: 'runtime',
          abstract: true,
          data: {
            authenticate: true
          },
          templateUrl: runtimeTemplatesPath + '/runtime-apps.html'
        })
        .state('home.runtime.tabs.runtimeAppsList', {
          url: '/runtime',
          templateUrl: runtimeTemplatesPath + '/runtime-apps-list.html',
          controller: 'RuntimeAppsController',
          data: {
            title: 'Runtime',
            authenticate: true
          }
        });
  });
  dashboard.run(function ($rootScope, $state, $stateParams, userService, featuresService, $log, $window, $http) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.dataflowServerUrl = window.location.protocol + '//' + window.location.host;
    $rootScope.xAuthTokenHeaderName = 'x-auth-token';
    $rootScope.user = userService;
    $rootScope.features = featuresService;
    $rootScope.pageRefreshTime = 5000;
    $rootScope.enableMessageRates = true;

    var xAuthToken = $window.sessionStorage.getItem('xAuthToken');
    if (xAuthToken !== null && userService.isAuthenticated) {
      console.log('User ' + userService.username + ' is already authenticated, populating http header ' + $rootScope.xAuthTokenHeaderName);
      $http.defaults.headers.common[$rootScope.xAuthTokenHeaderName] = xAuthToken;
    }
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.data.feature && !$rootScope.features[toState.data.feature]) {
          $log.error('Feature disabled: ' + toState.data.feature);
          $state.go('featureDisabled', {feature: toState.data.feature});
          event.preventDefault();
        } else if (userService.authenticationEnabled && toState.data.authenticate && !userService.isAuthenticated){
          $log.info('Need to authenticate...');
          $state.go('login');
          event.preventDefault();
        }
        else if (userService.authenticationEnabled && toState.data.authenticate &&
          userService.isAuthenticated && toState.data.roles && toState.data.roles.length > 0) {
          $log.info('State requires one of the following roles: ' + toState.data.roles);
          var found = false;
          angular.forEach(toState.data.roles, function(role){
            found = userService.hasRole(role);
          });
          if (!found) {
            $log.info('You do not have any of the necessary role(s) ' + toState.data.roles);
            $state.go('home.rolesMissing', {feature: toState.data.roles});
            event.preventDefault();
          }
        }
      });
  });
  return dashboard;
});
