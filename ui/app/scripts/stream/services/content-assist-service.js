define(function() {
    'use strict';

    return ['$http', '$q', function ($http, $q) {

        function getProposals(prefix) {
            var deferred = $q.defer();
            $http.get('/completions/stream', { params: {
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
