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
 * Definition bulk import apps controller.
 *
 * @author Alex Boyko
 */
define(function () {
    'use strict';
    return ['$scope', 'DataflowUtils', '$modal', '$state',
        function ($scope, utils, $modal, $state) {

            /**
             * Bulk Define Tasks.
             */
            $scope.bulkDefineTasks = function() {
                utils.$log.info('Bulk define clicked!');
            };

            /**
             * Takes one to All Applications page
             */
            $scope.cancel = function() {
                $state.go('home.tasks.tabs.definitions');
            };

            $scope.displayFileContents = function(contents) {
                $scope.dsl = contents;
            };

        }];
});
