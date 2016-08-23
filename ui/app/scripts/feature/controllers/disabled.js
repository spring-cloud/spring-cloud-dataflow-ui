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
 * Controller for feature disabled page
 *
 * @author Alex Boyko
 */
define([], function () {
    'use strict';

    var MESSAGES_MAP = {
        analyticsEnabled: 'ANALYTICS feature is disabled!',
        streamsEnabled: 'STREAMS feature is disabled!',
        tasksEnabled: 'TASKS feature is disabled!'
    };

    return ['$scope', 'DataflowUtils', '$stateParams', function ($scope, utils, $stateParams) {
        $scope.$apply(function() {
            utils.$log.info('Feature Disabled!');
            $scope.message = MESSAGES_MAP[$stateParams.feature];
            if (!$scope.message) {
                $scope.message = 'The feature is disabled on the server';
            }
        });
    }];
});
