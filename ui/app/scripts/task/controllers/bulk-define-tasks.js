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

            // function calculateValidationMarkers() {
            //     return {
            //         list: [
            //             {
            //                 from: {line: 0, ch: 0},
            //                 to: {line: 0, ch: 0},
            //                 message: 'Some error!',
            //                 severity: 'error'
            //             }
            //         ],
            //         numberOfErrors: 1,
            //         numberOfWarnings: 1
            //     };
            // }

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

            $scope.hint = {
                async: 'true',
                hint: function(cm, callback) { // jshint ignore:line
                    // TODO: calculate completion proposals and return results as shown below

                    // See https://codemirror.net/doc/manual.html#addons hint/show-hint.js section

                    // return callback({
                    //   list: listOfStrings
                    //   from: {line: startLine, ch:startCharIndex},
                    //   to: {line: endLine, ch:endCharIndex}
                    // });

                    utils.$log.info('Task DSL Content Assist Invoked!');
                }
            };

            $scope.lint = {
                async: true,
                getAnnotations: function (dslText, callback, options, doc) { // jshint ignore:line
                    // TODO: perform linting, return results as shown below
                    // markers.push({
                    //   from: range.start,
                    //   to: range.end,
                    //   message: 'Some error message!',
                    //   severity: 'error'
                    // callback(doc, markers);

                    utils.$log.info('Task DSL Lint invoked');

                    // var markers = calculateValidationMarkers();
                    // callback(doc, markers.list);
                    //
                    // $scope.numberOfErrors = markers.numberOfErrors;
                    // $scope.numberOfWarnings = markers.numberOfWarnings;
                }
            };

            $scope.$apply();

        }];
});
