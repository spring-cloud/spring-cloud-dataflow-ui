/*
 * Copyright 2013-2017 the original author or authors.
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
 * Definition of Dashboard auth services.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('dataflowAuth.services', [])
      .factory('userService', function(securityInfo, $rootScope, $window, $http) {
          var user = {
            authenticationEnabled: securityInfo.authenticationEnabled,
            authorizationEnabled: securityInfo.authorizationEnabled,
            isAuthenticated: securityInfo.authenticated,
            username: securityInfo.username,
            roles: securityInfo.roles,
            isFormLogin: securityInfo.formLogin,
            hasRole: function(role) {
              if (user.roles.indexOf(role) >= 0){
                return true;
              }
              else {
                return false;
              }
            },
            resetUser: function() {
              user.authenticationEnabled = null;
              user.authorizationEnabled = null;
              user.isAuthenticated = null;
              user.isFormLogin = null;
              user.roles = [];
              user.username = null;
              $rootScope.user.username = '';
              $rootScope.user.isAuthenticated = false;
            },
            populateUser: function(userInfo) {
              user.authenticationEnabled = userInfo.authenticationEnabled;
              user.authorizationEnabled = userInfo.authorizationEnabled;
              user.isAuthenticated = userInfo.authenticated;
              user.isFormLogin = userInfo.formLogin;
              user.roles = userInfo.roles;
              user.username = userInfo.username;

              $rootScope.user.username = user.username;
              $rootScope.user.isAuthenticated = user.isAuthenticated;
            },
            restoreUser: function (xAuthToken) {
                if (xAuthToken !== null) {
                  $http.defaults.headers.common[$rootScope.xAuthTokenHeaderName] = xAuthToken;
                  $window.sessionStorage.setItem('xAuthToken', xAuthToken);
                }

                var securityInfoUrl = '/security/info';
                var timeout = 20000;
                var promiseHttp = $http.get(securityInfoUrl, {timeout: timeout});

                promiseHttp.then(function(response) {
                  console.log('Security info retrieved ...', response.data);

                  $rootScope.user = {
                    username: response.data.username,
                    isAuthenticated: response.data.authenticated,
                    isFormLogin: true,
                    roles: response.data.roles
                  };

                  console.log($rootScope.user);
                });
                return promiseHttp;
            }
          };
          return user;
        })
      .factory('LoginService', function () {
      });
});
