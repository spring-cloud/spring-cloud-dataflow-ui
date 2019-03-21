/*
 * Copyright 2013-2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Dashboard Stream services.
 *
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define(function(require) {
  'use strict';

  var angular = require('angular');

  return angular.module('dataflowStreams.services', ['ui.bootstrap'])
      .factory('StreamService', function ($resource, $rootScope, $log, $http) {
        return {
          getDefinitions: function (pageable) {
            var params = {};
            if (pageable === undefined) {
              $log.info('Getting all stream definitions.');
            }
            else {
              $log.info('Getting paged stream definitions', pageable);
              params = {
                'page': pageable.pageNumber,
                'size': pageable.pageSize
              };

              params.sort = pageable.calculateSortParameter();

              if (pageable.filterQuery && pageable.filterQuery.trim().length > 0) {
                params.search = pageable.filterQuery;
              }
            }
            return $resource($rootScope.dataflowServerUrl + '/streams/definitions', params, {
              query: {
                method: 'GET'
              }
            }).get();
          },
          getSingleStreamDefinition: function (streamName) {
            $log.info('Getting single stream definition for stream named ' + streamName);
            return $http({
              method: 'GET',
              url: $rootScope.dataflowServerUrl + '/streams/definitions/' + streamName
            });
          },
          getRelatedDefinitions: function(streamName, nested) {
            return $http({
              method: 'GET',
              url: $rootScope.dataflowServerUrl + '/streams/definitions/' + streamName + '/related',
              params: {
                nested: nested
              }
            });
          },
          deploy: function (streamDefinition, properties) {
            $log.info('Deploy Stream ' + streamDefinition.name);
            return $resource($rootScope.dataflowServerUrl + '/streams/deployments/' + streamDefinition.name, null, {
              deploy: {
                method: 'POST',
                params: {
                  properties: properties
                }
              }
            }).deploy();
          },
          undeploy: function (streamDefinition) {
            $log.info('Undeploy Stream ' + streamDefinition.name);
            return $resource($rootScope.dataflowServerUrl + '/streams/deployments/' + streamDefinition.name, null, {
              undeploy: { method: 'DELETE' }
            }).undeploy();
          },
          destroy: function (streamDefinition) {
            $log.info('Undeploy Stream ' + streamDefinition.name);
            return $resource($rootScope.dataflowServerUrl + '/streams/definitions/' + streamDefinition.name, null, {
              destroy: { method: 'DELETE' }
            }).destroy();
          },
          create: function(streamName, streamDefinition, deploy) {
        	$log.info('Creating Stream name=' + streamName + ' def=' + streamDefinition);
        	return $http({
                method: 'POST',
                url: $rootScope.dataflowServerUrl + '/streams/definitions',
                params: {
                	name: streamName,
                	definition: streamDefinition,
                	deploy: deploy ? true : false
                }
              });
          }
        };
      }).
      factory('StreamMetamodelService',require('stream/services/metamodel')).
      factory('StreamEditorService', require('stream/services/editor-service')).
      factory('StreamRenderService', require('stream/services/render-service')).
      factory('StreamContentAssistService', require('stream/services/content-assist-service'));

});
