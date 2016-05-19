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
define(['./app'], function (xdAdmin) {
  'use strict';
  xdAdmin.config(function ($stateProvider, $urlRouterProvider, $httpProvider, hljsServiceProvider, growlProvider, $animateProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpErrorInterceptor');
    $urlRouterProvider.otherwise('/streams/definitions');

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
        sharedTemplatesPath = 'scripts/shared/views',
        containerTemplatesPath = 'scripts/container/views',
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
        authenticate: true
      }
    })
    .state('home.jobs', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true
      }
    })
    .state('home.analytics', {
      abstract: true,
      template: '<ui-view/>',
      data: {
        authenticate: true
      }
    })
    .state('home.apps', {
      abstract: true,
      template: '<ui-view/>',
      data: {
        authenticate: true
      }
    })
    .state('home.streams', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true
      }
    })
    .state('home.containers', {
      abstract:true,
      template: '<ui-view/>',
      data:{
        authenticate: true
      }
    })
    .state('home.jobs.tabs', {
      url : 'jobs',
      abstract:true,
      data:{
        authenticate: true
      },
      templateUrl : jobTemplatesPath + '/jobs.html'
    })
    .state('home.tasks.tabs', {
      url : 'tasks',
      abstract:true,
      data:{
        authenticate: true
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
    .state('home.streams.tabs', {
      url : 'streams',
      abstract:true,
      data:{
        authenticate: true
      },
      templateUrl : streamTemplatesPath + '/streams.html'
    })
    .state('home.streams.tabs.definitions', {
      url : '/definitions',
      templateUrl : streamTemplatesPath + '/definitions.html',
      controller: 'StreamsDefinitionsController'
    })
    .state('home.streams.tabs.create', {
      url : '/create',
      templateUrl : streamTemplatesPath + '/create-stream.html',
      controller: 'StreamsCreationController'
    })
    .state('home.streams.deployStream', {
      url : 'streams/definitions/{definitionName}/deploy',
      templateUrl : streamTemplatesPath + '/definition-deploy.html',
      controller: 'DefinitionDeployController',
      data:{
        authenticate: true
      }
     })

    .state('home.jobs.tabs.definitions', {
      url : '/definitions',
      templateUrl : jobTemplatesPath + '/definitions.html',
      controller: 'JobDefinitionsController'
    })
    .state('home.jobs.tabs.executions', {
      url : '/executions',
      templateUrl : jobTemplatesPath + '/executions.html',
      controller: 'JobExecutionsController'
    })
    .state('home.jobs.executiondetails', {
      url : 'jobs/executions/{executionId}',
      templateUrl : jobTemplatesPath + '/execution-details.html',
      controller: 'JobExecutionDetailsController'
    })
    .state('home.jobs.stepexecutiondetails', {
      url : 'jobs/executions/{executionId}/{stepExecutionId}',
      templateUrl : jobTemplatesPath + '/stepexecution-details.html',
      controller: 'StepExecutionDetailsController'
    })
    .state('home.jobs.stepexecutionprogress', {
      url : 'jobs/executions/{executionId}/{stepExecutionId}/progress',
      templateUrl : jobTemplatesPath + '/stepexecution-progress.html',
      controller: 'StepExecutionProgressController'
    })
    .state('home.jobs.deploymentsSchedule', {
      url : 'schedule/{jobName}',
      templateUrl : jobTemplatesPath + '/schedule.html',
      controller: 'JobScheduleController'
    })
    .state('home.tasks.tabs.modules', {
      url : '/apps',
      templateUrl : taskTemplatesPath + '/modules.html',
      controller: 'ModuleController'
    })
    .state('home.tasks.moduledetails', {
      url : 'tasks/modules/{moduleName}',
      templateUrl : taskTemplatesPath + '/module-details.html',
      controller: 'ModuleDetailsController',
      data:{
        title: 'Module Details',
        authenticate: true
      }
    })
    .state('home.tasks.modulecreatedefinition', {
      url : 'tasks/modules/{moduleName}/create-definition',
      templateUrl : taskTemplatesPath + '/module-create-definition.html',
      controller: 'ModuleCreateDefinitionController',
      data:{
        title: 'Module Create Definition',
        authenticate: true
      }
    })
    .state('home.tasks.tabs.definitions', {
      url : '/definitions',
      templateUrl : taskTemplatesPath + '/definitions.html',
      controller: 'TaskDefinitionsController'
    })
        .state('home.tasks.deploymentsLaunch', {
          url: 'tasks/definitions/launch/{taskName}',
          templateUrl: taskTemplatesPath + '/launch.html',
          controller: 'TaskLaunchController'
        })
        .state('home.tasks.tabs.executions', {
          url: '/executions',
          templateUrl: taskTemplatesPath + '/executions.html',
          controller: 'TaskExecutionsController'
        })
        .state('home.analytics.tabs', {
          url: 'analytics',
          abstract: true,
          data: {
            authenticate: true
          },
          templateUrl: analyticsTemplatesPath + '/analytics.html'
        })
        .state('home.analytics.tabs.dashboard', {
          url: '/dashboard',
          templateUrl: analyticsTemplatesPath + '/dashboard.html',
          controller: 'DashboardController',
          data: {
            title: 'Dashboard',
            authenticate: true
          }
        })
        .state('home.analytics.tabs.counters', {
          url: '/counters',
          templateUrl: analyticsTemplatesPath + '/counters.html',
          controller: 'CountersController',
          data: {
            title: 'Counters',
            authenticate: true
          }
        })
        .state('home.analytics.tabs.gauges', {
          url: '/gauges',
          templateUrl: analyticsTemplatesPath + '/gauges.html',
          controller: 'GaugesController',
          data: {
            title: 'Gauges',
            authenticate: true
          }
        })
        .state('home.analytics.tabs.richgauges', {
          url: '/rich-gauges',
          templateUrl: analyticsTemplatesPath + '/rich-gauges.html',
          controller: 'RichGaugesController',
          data: {
            title: 'Rich-Gauges',
            authenticate: true
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
        .state('home.apps.tabs.modules', {
          url: '/apps',
          templateUrl: appTemplatesPath + '/modules.html',
          controller: 'ModulesController',
          data: {
            title: 'Modules',
            authenticate: true
          }
        })
        .state('home.apps.registerModules', {
          url: 'apps/register-modules',
          templateUrl: appTemplatesPath + '/register-modules.html',
          controller: 'RegisterModulesController',
          data: {
            title: 'Register Modules',
            authenticate: true
          }
        })
        .state('home.containers.tabs', {
          url: 'containers',
          abstract: true,
          data: {
            authenticate: true
          },
          templateUrl: containerTemplatesPath + '/containers.html'
        })
        .state('home.containers.tabs.containerlist', {
          url: '/containers',
          templateUrl: containerTemplatesPath + '/containerlist.html',
          controller: 'ContainersController',
          data: {
            title: 'Runtime',
            authenticate: true
          }
        });
  });
  xdAdmin.run(function ($rootScope, $state, $stateParams, userService, $log) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.xdAdminServerUrl = window.location.protocol + '//' + window.location.host;
    $rootScope.xAuthTokenHeaderName = 'x-auth-token';
    $rootScope.user = userService;
    $rootScope.pageRefreshTime = 5000;
    $rootScope.enableMessageRates = true;

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (userService.authenticationEnabled && toState.data.authenticate && !userService.isAuthenticated){
          $log.info('Need to authenticate...');
          $state.go('login');
          event.preventDefault();
        }
      });
  });
  return xdAdmin;
});
