/*
 * Copyright 2016 the original author or authors.
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
 * Stream definition detailed graph controller
 *
 * @author Alex Boyko
 */
define(function(require) {
    'use strict';

    var angular = require('angular');

    return ['DataflowUtils', '$scope', '$state', '$stateParams', 'StreamService',
        function (utils, $scope, $state, $stateParams, streamService) {

            $scope.back = function() {
                $state.go('home.streams.tabs.definitions');
            };

            $scope.streamName = $stateParams.streamName;

            streamService.getRelatedDefinitions($scope.streamName, true).then(function(results) {
                var streams = results.data._embedded.streamDefinitionResourceList;
                if (streams && angular.isArray(streams) && streams.length > 0) {
                    var dsl = '';
                    streams.forEach(function(stream) {
                        dsl += stream.name + '=' + stream.dslText + '\n';
                    });
                    $scope.definition = {
                        text: dsl,
                        name: $scope.streamName
                    };
                } else {
                    $scope.definition = {
                        text: '',
                        name: $scope.streamName
                    };
                }
                $scope.flo.updateGraphRepresentation();
            });

            $scope.$apply();

        }
    ];
});
