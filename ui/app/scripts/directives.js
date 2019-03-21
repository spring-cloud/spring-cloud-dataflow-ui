/*
 * Copyright 2014-2016 the original author or authors.
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
 * Definition of custom directives.
 *
 * @author Gunnar Hillert
 * @author Alex Boyko
 */
define(['angular', 'xregexp', 'moment'], function(angular) {
  'use strict';
  angular.module('dataflowMain.directives', [])
    .directive('dataflowParseUrls', [function() {
      var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;

      return {
        restrict: 'A',
        //transclude: true,
        //scope: {},
        link: function (scope, element) {
          var originalValue = scope.contextValue.value;
          var newHtml = originalValue;
          var matches;

          if (originalValue.substring) {
            matches = originalValue.match(urlPattern);
          }
          if (typeof matches !== 'undefined') {
            angular.forEach(matches, function(url) {
              newHtml = newHtml.replace(url, '<a href=\''+ url + '\'>' + url + '</a>');
            });
          }
          element.html(newHtml);
        }
      };
    }])
    .directive('dataflowFormatStream', [function() {
      var mainRegex = new XRegExp(
          '(--[\\p{Z}]*(password|passwd)[\\p{Z}]*=[\\p{Z}]*)(("[\\p{L}|\\p{Pd}|\\p{Ps}|\\p{Pe}|\\p{Pc}|\\p{S}|\\p{N}|\\p{Z}]*")|([\\p{N}|\\p{L}|\\p{Po}|\\p{Pc}|\\p{S}]*))', 'gi');

      var subRegex = new XRegExp('\\P{C}', 'gi');
      var linkFunction = function(scope, element) {
        scope.$watch('dataflowFormatStream', function(originalStreamDefinition){
          if(originalStreamDefinition) {
            var result = XRegExp.replace(originalStreamDefinition, mainRegex, function(match, p1, p2, p3) {
              if (p3.charAt(0) === '"' && p3.slice(-1) === '"') {
                var resultWithoutQuotes = p3.substr(1, p3.length-2);
                var maskedResult = XRegExp.replace(resultWithoutQuotes, subRegex,'*');
                return p1 + '"' + maskedResult + '"';
              }
              return p1 + XRegExp.replace(p3, subRegex,'*');
            });
            element.text(result);
          }
        });
      };
      return {
        restrict: 'A',
        scope: {
          dataflowFormatStream: '='
        },
        link: linkFunction,
      };
    }])
    .directive('dataflowDuration', [function() {

      var linkFunction = function(scope, el) {
        var startDateTime;
        var endDateTime;
        var element;

        function updateDuration() {
          if (startDateTime && endDateTime) {
            var duration = moment.duration(endDateTime - startDateTime);
            element.html(duration.asMilliseconds() + ' ms');
            console.log(duration);
          }
        }
        element = el;
        scope.$watch('start', function(value){
          if (value) {
            startDateTime = moment(value);
            updateDuration();
          }
        });
        scope.$watch('end', function(value){
          if (value) {
            endDateTime = moment(value);
            updateDuration();
          }
        });

      };
      return {
        restrict: 'A',
        scope: {
          dataflowDuration: '=',
          start: '=',
          end: '='
        },
        link: linkFunction,
      };
    }])
    .directive('dataflowDateTime', [function() {
      var dateTimeFormat = 'YYYY-MM-DD HH:mm:ss,SSS';

      var linkFunction = function(scope, element, attributes) {

        function formatDateTime(dateTimeValue) {
          if (dateTimeValue) {
            var startDateTime = moment(dateTimeValue);
            element.html('<span title="UTC Timezone offset: ' + moment().zone() +' minutes">' + startDateTime.format(dateTimeFormat) + '</span>');
          }
          else {
            element.html('N/A');
          }
        }

        formatDateTime(attributes.dataflowDateTime);

        attributes.$observe('dataflowDateTime', function(value){
          if (value) {
            formatDateTime(value);
          }
        });
      };
      return {
        restrict: 'A',
        scope: {
          dataflowDateTime: '@'
        },
        link: linkFunction,
      };
    }])
    .directive('integer', function() {
      var INTEGER_REGEXP = /^\-?\d+$/;
      return {
        require: 'ngModel',
        link: function(scope, element, attributes, controller) {
          controller.$parsers.unshift(function(viewValue) {
            if (INTEGER_REGEXP.test(viewValue)) {
              // it is valid
              controller.$setValidity('integer', true);
              return viewValue;
            } else {
              // it is invalid, return undefined (no model update)
              controller.$setValidity('integer', false);
              return undefined;
            }
          });
        }
      };
    })
    .directive('dataflowModal', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          if (typeof scope.stopPolling === 'function') {
            scope.stopPolling();
          }
          scope.closeModal = function() {
            element.modal('hide');
            if (typeof scope.startPolling === 'function') {
              scope.startPolling();
            }
          };
        }
      };
    })
    .directive('dataflowFormAutofocus', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          scope.focusInvalidField = function() {
            element.find('.ng-invalid:visible').first().focus();
          };
          element.on('submit', scope.focusInvalidField);
          scope.focusInvalidField();
        }
      };
    })
    .directive('dataflowDeploymentStatus', function() {
      var linkFunction = function(scope) {
        scope.$watch('dataflowDeploymentStatus', function(resource){
          if (resource) {
            if (!resource.defined) {
              scope.labelClass = 'danger';
              scope.label = 'Deleted';
            }
          }
        });
      };
      return {
        restrict: 'A',
        scope: {
          dataflowDeploymentStatus: '='
        },
        link: linkFunction,
        templateUrl: 'scripts/directives/dataflowDeploymentStatus.html'
      };
    })
    .directive('dataflowComposedJobStatus', function() {
      var linkFunction = function(scope) {
        scope.$watch('dataflowComposedJobStatus', function(resource){
          if (resource) {
            if (resource.composedJob) {
              scope.labelClass = 'info';
              scope.label = 'Composed';
            }
          }
        });
      };
      return {
        restrict: 'A',
        scope: {
          dataflowComposedJobStatus: '='
        },
        link: linkFunction,
        templateUrl: 'scripts/directives/dataflowComposedJobStatus.html'
      };
    })
    .directive('dataflowPopover', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attributes) {
          attributes.$observe('dataflowPopover', function(attributeValue){
            element.popover({
              placement: 'bottom',
              html: 'true',
              trigger: 'click',
              content: function () {
                return $(attributeValue).html();
              }
            })
            .on('show.bs.popover', function(){
              if (typeof scope.stopPolling === 'function') {
                scope.stopPolling();
              }
              $(this).data('bs.popover').tip().css('max-width', $(this).closest('#dataflow-content').width() + 'px');
              scope.$on('$destroy', function() {
                angular.element('.popover').remove();
              });
            })
            .on('hide.bs.popover', function(){
              if (typeof scope.startPolling === 'function') {
                scope.startPolling();
              }
            });
          });
        }
      };
    })
    .directive('dataflowTooltip', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attributes) {
          attributes.$observe('title', function(){
            element.tooltip()
            .on('show.bs.tooltip', function(){
              if (typeof scope.stopPolling === 'function') {
                scope.stopPolling();
              }
            })
            .on('hide.bs.tooltip', function(){
              if (typeof scope.startPolling === 'function') {
                scope.startPolling();
              }
            });
          });
        }
      };
	})
    .directive('notTheSameAs', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attributes, controller) {
          var validate = function(viewValue) {
            var comparisonModel = attributes.notTheSameAs;

            if(!viewValue || !comparisonModel){
              controller.$setValidity('notTheSameAs', true);
            }
            controller.$setValidity('notTheSameAs', viewValue !== comparisonModel);
            return viewValue;
          };
          controller.$parsers.unshift(validate);
          controller.$formatters.push(validate);

          attributes.$observe('notTheSameAs', function(){
            return validate(controller.$viewValue);
          });
        }
      };
    })
    .directive('validateCronExpression', function($http, $rootScope, $q) {
      return {
        require : 'ngModel',
        link : function($scope, element, attrs, ngModel) {

          var isActive = false;

          $scope.$watch(attrs.validateCronExpression, function(value){
            isActive = value;
            if (!isActive) {
              ngModel.$setValidity('cronExpressionValid', true);
            }
            else {
              ngModel.$validate();
            }
          });
          ngModel.$asyncValidators.cronExpressionValid = function(modelValue) {
            var deferred = $q.defer();
            if (isActive) {
              if (modelValue) {
                $http({
                  method: 'POST', url: $rootScope.dataflowServerUrl + '/validation/cron', data: {
                    cronExpression: modelValue
                  }
                }).success(function (data) {
                  $scope.cronValidation = data;
                  if (data.valid) {
                    console.log('Cron Expression valid', data);
                    deferred.resolve();
                  }
                  else {
                    console.log('Cron Expression invalid', data);
                    deferred.reject();
                  }
                }).error(function (data) {
                  console.log('An error occurred during HTTP post', data);
                  $scope.cronValidation = {
                    errorMessage: 'An error occurred during HTTP post'
                  };
                  deferred.reject();
                });
              }
              else {
                deferred.reject();
              }
            }
            else {
              deferred.resolve();
            }
            return deferred.promise;
          };
        }
      };
    })
    .directive('onReadFile', function ($parse) {
      return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
          element.bind('change', function() {

            var onFileReadFn = $parse(attrs.onReadFile);
            var reader = new FileReader();

            reader.onload = function() {
              var fileContents = reader.result;
              scope.$apply(function() {
                onFileReadFn(scope, {
                  'contents' : fileContents
                });
              });
            };
            reader.readAsText(element[0].files[0]);
          });
        }
      };
    })
    .directive('clearSelectedFile', function () {
      return {
        restrict: 'A',
        scope: false,
        link: function(scope, element) {
          element.bind('change', function() {
            element.val(null);
          });
        }
      };
    })
    .directive('tableSort', function() {
      function applySort(scope) {
        if( scope.sortState.sortProperty.toString() === scope.sortProperty.toString() && scope.sortState.sortOrder === 'DESC' ) {
          scope.sortState.sortOrder = 'ASC';
        }
        else if( scope.sortState.sortProperty.toString() === scope.sortProperty.toString() && scope.sortState.sortOrder === 'ASC' ) {
          scope.sortState.sortOrder = 'DESC';
        }
        else {
          scope.sortState.sortOrder = 'ASC';
        }
        scope.sortState.sortProperty = scope.sortProperty;
        scope.sortOrderChangeHandler()(scope.sortState);
      }
      return {
        restrict: 'A',
        transclude: true,
        template :
        '<a ng-click="onClick()">'+
        '<span ng-transclude></span> '+
        '<i class="glyphicon" ng-class="{\'glyphicon-triangle-bottom\' : sortState.sortOrder === \'DESC\' && sortProperty.toString() === sortState.sortProperty.toString(),  \'glyphicon-triangle-top\' : sortState.sortOrder===\'ASC\' && sortProperty.toString() === sortState.sortProperty.toString()}"></i>'+
        '</a>',
        scope: {
          sortOrderChangeHandler: '&',
          sortProperty: '=',
          sortState: '='
        },
        link: function(scope) {
          scope.onClick = function () {
            applySort(scope);
          };

        },
      };
    });
});
