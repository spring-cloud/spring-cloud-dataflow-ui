/*
 * Copyright 2014-2016 the original author or authors.
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
 * Definition of the Stream Creation controller
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define(function(require) {
  'use strict';

  var graphUtils = require('../services/utils');

  var GRID_ON_COOKIE_KEY = 'createStream.grid.on';
  var AUTOLINK_ON_COOKIE_KEY = 'createStream.autolink.on';
  
  return ['XDUtils', '$scope', 'StreamMetamodelServiceXD', '$modal','$cookieStore',
    function (utils, $scope, metamodelService, $modal, $cookieStore) {
	  utils.$log.info('Stream Creation Controller running (create.js)');

  	  $scope.definition = {
		  name: '',
		  text: ''
	  };

  	  if (!$scope.flo) {
  		  $scope.flo = {};
  	  }

	  $scope.flo.autolink = $cookieStore.get(AUTOLINK_ON_COOKIE_KEY);
	  $scope.gridOn = $cookieStore.get(GRID_ON_COOKIE_KEY);

	  $scope.paperPadding = 50;

	  $scope.createStreamDefs = function() {
		  $modal.open({
			  animation: true,
			  templateUrl: 'scripts/stream/views/create-stream-dialog.html',
			  controller: 'CreateStreamsDialogController',
			  resolve: {
				  definitionData: function () {
					  var dependencyLineMap = {};
					  var graph = $scope.flo.getGraph();
					  graph.getElements().filter(function(element) {
						  return graphUtils.canBeHeadOfStream(graph, element);
					  }).forEach(function(streamHead) {
						  var line = streamHead.attr('range/start/line');
						  if (typeof line === 'number') {
							  graph.getConnectedLinks(streamHead, {inbound: true}).forEach(function(link) {
								  if (link.get('source').port === 'tap') {
									  var source = graph.getCell(link.get('source').id);
									  if (source && typeof source.attr('range/start/line') === 'number') {
										  var parentLine = source.attr('range/start/line');
										  if (!dependencyLineMap[parentLine]) {
											  dependencyLineMap[parentLine] = [];
										  }
										  dependencyLineMap[parentLine].push(line);
									  }
								  }
							  });
						  }
					  });

					  // Remove empty lines from text definition and strip off white space
					  // Create map of old line numbers to new line numbers for streams
					  var old2newLineNumbers = {};
					  var newLineNumber = 0;
					  var text = '';
					  $scope.definition.text.split('\n').forEach(function(line, lineNumber) {
						  var newLine = line.trim();
						  if (newLine.length > 0) {
							  text += (newLineNumber ? '\n' : '') + line.trim();
							  old2newLineNumbers[lineNumber] = newLineNumber;
							  newLineNumber++;
						  }
					  });

					  // Create stream dependency map based on new line numbers 
					  var dependencyMap = {};
					  Object.keys(dependencyLineMap).forEach(function(oldLine) {
						  dependencyMap[old2newLineNumbers[oldLine]] = dependencyLineMap[oldLine].map(function(entry) {
							  return old2newLineNumbers[entry];
						  });
					  });
					  
					  return {
						  text: text,
						  dependencies: dependencyMap,
						  totalNumber: newLineNumber
					  };
				  }
			  }
		  }).result.then(function(created) {
			  if (created) {
				  $scope.flo.createNewFlow();
			  }
		  });
  	  };
		
        $scope.$watch('gridOn', function(newValue) {
           if (newValue) {
               $scope.flo.gridSize(40);
           } else {
               $scope.flo.gridSize(1);
           }
        });

        $scope.$on('$destroy', function() {
            if ($scope.gridOn) {
                $cookieStore.put(GRID_ON_COOKIE_KEY, $scope.gridOn);
            } else {
                $cookieStore.remove(GRID_ON_COOKIE_KEY);
            }
            if ($scope.flo.autolink) {
                $cookieStore.put(AUTOLINK_ON_COOKIE_KEY, $scope.flo.autolink);
            } else {
                $cookieStore.remove(AUTOLINK_ON_COOKIE_KEY);
            }
        });

    }];
});
