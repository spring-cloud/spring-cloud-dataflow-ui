/*
 * Copyright 2014-2016 the original author or authors.
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
 * Handles user logins.
 *
 * @author Gunnar Hillert
 * @author Alex Boyko
 */

define([], function () {
  'use strict';
  return ['$scope', '$state', 'userService', 'DataflowUtils', '$log', '$rootScope', '$http', '$window',
          function ($scope, $state, userService, utils, $log, $rootScope, $http, $window) {
          $scope.loginModel = {
            username: '',
            password: ''
          };
          $scope.errorMessage = null;

          $scope.login = function() {
            $log.info('Logging in user:', $scope);
            var authenticationPromise = $http.post($rootScope.dataflowServerUrl + '/authenticate', $scope.loginModel);
            utils.addBusyPromise(authenticationPromise);
            authenticationPromise.then(
              function(response) {
                var oauthToken = response.data;
                $http.defaults.headers.common[$rootScope.xAuthTokenHeaderName] = oauthToken;

                var securityInfoUrl = '/security/info';
                var timeout = 20000;
                var promiseHttp = $http.get(securityInfoUrl, {timeout: timeout});

                promiseHttp.then(function(response) {
                  console.log('Security info retrieved ...', response.data);
                  userService.populateUser(response.data);
                  $window.sessionStorage.setItem('xAuthToken', oauthToken);

                  if (response.data.authenticated) {
                    utils.growl.success('User ' + response.data.username + ' logged in.');
                    $scope.loginModel = {
                      username: '',
                      password: ''
                    };
                    $state.go('home.apps.tabs.appsList');
                  }
                  else {
                    $scope.errorMessage = 'Login failed. Please retry.';
                  }
                }, function(errorResponse) {
                  console.log('Error getteng securityInfo', errorResponse);
                  $scope.errorMessage = 'Error retrieving security info from ' + securityInfoUrl + ' (timeout: ' + timeout + 'ms)';
                });
              },
              function(response) {
                $scope.errorMessage = response.data[0].message ;
                utils.growl.error(response.data[0].message);
              }
            );
          };
          $scope.logout = function() {
            $state.go('logout');
          };
        }];
});
