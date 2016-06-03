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
 * Definition of Dashboard streams controllers.
 *
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('dataflowStreams.controllers', ['dataflowStreams.services'])
      .controller('StreamsDefinitionsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['stream/controllers/definitions'], function (streamDefinitionsController) {
              $injector.invoke(streamDefinitionsController, this, {'$scope': $scope});
            });
          }])
      .controller('StreamsCreationController',
    	  ['$scope','$injector', function ($scope, $injector) {
    		require(['stream/controllers/create'], function (streamCreationController) {
    			$injector.invoke(streamCreationController, this, {'$scope': $scope});
    		});
    	  }])
      .controller('CreateStreamsDialogController',
      ['$scope','$injector', '$modalInstance', 'definitionData', function ($scope, $injector, $modalInstance, definitionData) {
          require(['stream/controllers/create-streams-dialog'], function (createStreamsDialogController) {
              $injector.invoke(createStreamsDialogController, this, {'$scope': $scope, '$modalInstance': $modalInstance, 'definitionData': definitionData});
          });
      }])
      .controller('PropertiesDialogController',
      ['$scope','$injector', '$modalInstance', 'cell', 'isStreamStart', function ($scope, $injector, $modalInstance, cell, isStreamStart) {
          require(['stream/controllers/properties-dialog'], function (propertiesDialogController) {
              $injector.invoke(propertiesDialogController, this, {'$scope': $scope, '$modalInstance': $modalInstance, 'cell': cell, 'isStreamStart': isStreamStart});
          });
      }])
      .controller('DefinitionDeployController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['stream/controllers/definition-deploy'], function (streamDefinitionDeployController) {
              $injector.invoke(streamDefinitionDeployController, this, {'$scope': $scope});
            });
          }]);
});
