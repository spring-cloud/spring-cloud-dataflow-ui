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
 * Service providing content assist for task definitions.
 * 
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function() {
    'use strict';

    return ['$http', '$q', function ($http, $q) {

        function getProposals(prefix) {
            var deferred = $q.defer();
            $http.get('/completions/task', { params: {
                start: prefix,
                detailLevel: 1
            }}).success(function (completions) {
                deferred.resolve(completions.proposals);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        return {
            'getProposals': getProposals
        };

    }];

});
