/*
 * Copyright 2013-2014 the original author or authors.
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
 * Dashboard runtime module services.
 *
 * @author Ilayaperumal Gopinathan
 * @author Gunnar Hillert
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('xdContainerAdmin.services', [])
      .factory('ContainerService', function ($resource, $rootScope, $log) {
        return {
          getContainers: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all containers.');
              return $resource($rootScope.xdAdminServerUrl + '/runtime/apps', {}).get();
            }
            else {
              $log.info('Getting containers for pageable:', pageable);
              return $resource($rootScope.xdAdminServerUrl + '/runtime/apps',
                {
                  'page': pageable.pageNumber,
                  'size': pageable.pageSize
                }).get();
            }
          },
          shutdownContainer: function (containerId) {
            return $resource($rootScope.xdAdminServerUrl + '/runtime/containers?containerId=' + containerId, null, {
              shutdownContainer: {
                method: 'DELETE'
              }
            }).shutdownContainer();
          }
        };
      });
});
