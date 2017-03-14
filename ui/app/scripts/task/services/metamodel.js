/*
 * Copyright 2017 the original author or authors.
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
 * Flo Meta-Model service for Composed Task editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function(require) {
    'use strict';

    var joint = require('joint');

    var angular = require('angular');

    var COMPOSED_TASK_LABEL = 'label';

    require('flo');

    joint.shapes.flo.batch = {};

    joint.shapes.flo.batch.CONTROL_NODES = 'control nodes';

    joint.shapes.flo.batch.START_NODE_TYPE = 'START';
    joint.shapes.flo.batch.END_NODE_TYPE = 'END';
    joint.shapes.flo.batch.SYNC_NODE_TYPE = 'SYNC';
    joint.shapes.flo.batch.FAIL_NODE_TYPE = 'FAIL';

    var CONTROL_NODES_METADATA = [
        {
            'group': joint.shapes.flo.batch.CONTROL_NODES,
            'name': joint.shapes.flo.batch.START_NODE_TYPE,
            'shortDescription': 'Start element for the composed task. Global options for the task are set on this element.',
            'noPaletteEntry': true,
            'properties': {
                'timeout': {
                    'id': 'timeout',
                    'name': 'timeout',
                    'defaultValue': null,
                    'description': 'Execution timeout',
                    'type': 'java.lang.Long'
                }
            }
        },
        {
            'group': joint.shapes.flo.batch.CONTROL_NODES,
            'name': joint.shapes.flo.batch.END_NODE_TYPE,
            'shortDescription': 'End element for a flow or the entire composed task.',
            'noPaletteEntry': true,
            'metadata': {
                'noEditableProps': true
            }
        },
        {
            'group': joint.shapes.flo.batch.CONTROL_NODES,
            'name' : joint.shapes.flo.batch.SYNC_NODE_TYPE,
            'shortDescription': 'After a split, a sync node pulls the threads of parallel tasks back together',
            'metadata': {
                'noEditableProps': true
            }
        },
        // {
        //     'group': joint.shapes.flo.batch.CONTROL_NODES,
        //     'name' : joint.shapes.flo.batch.FAIL_NODE_TYPE,
        //     'shortDescription': 'Composed task failure',
        //     'metadata': {
        //         'noEditableProps': true
        //     }
        // }
    ];

    return ['$http', 'DataflowUtils', 'MetamodelUtils', 'TaskAppService', /*'TaskDefinitions',*/
        function ($http, utils, metamodelUtils, taskAppService/*, taskDefinitionsService*/) {

            // Pre ES6 browsers don't have 'startsWith' function, hence add it if necessary
            // TODO: remove in the future
            if (typeof String.prototype.startsWith !== 'function') {
                String.prototype.startsWith = function(s){
                    return this.slice(0, s.length) === s;
                };
            }

            /**
             * List of listeners to metamodel changes
             * Each listener may have the following functions defined: metadataChanged(oldData, newData), metadataRefresh(), metadataError()
             * @type {Object}
             */
            var listeners = [];

            /**
             * Map from palette group names to maps from palette entry names to palette data objects
             * // Map<String,Map<String,PaletteData>>
             * TODO [palette] is this jsdoc tag right?
             * @type {Object.<string,{Object.<string,PaleteData>}>}
             */
            var metamodel;

            /**
             * Internally stored metamodel load promise
             */
            var request;

            /**
             * Subscribes a listener object to the meta-model events bus
             * @param listener the listener object which may support functions: metadataRefresh, metadataError,
             * metadataChanged.
             */
            function subscribe(listener) {
                listeners.push(listener);
            }

            /**
             * Removes the listener object from the meta-model event bus
             * @param listener the listener object
             */
            function unsubscribe(listener) {
                var index = listeners.indexOf(listener);
                if (index >= 0) {
                    listeners.splice(index);
                }
            }

            /**
             * List of groups in a specific order for the palette
             * @returns {[string,string,string,string]}
             */
            function groups() {
                return ['control nodes', 'apps', 'definitions'];
            }

            function loadTaskApps(metamodel) {
               var promise = taskAppService.getAllApps().$promise;
               promise.then(function(result) {
                   if (result && result._embedded && result._embedded.appRegistrationResourceList && Array.isArray(result._embedded.appRegistrationResourceList)) {
                       result._embedded.appRegistrationResourceList.forEach(function(app) {

                           var infoPromise;
                           var get = function(property) {
                               if (!infoPromise) {
                                   infoPromise = taskAppService.getSingleApp(app.name).$promise;
                               }
                               var infoDeferred = utils.$q.defer();
                               infoPromise.then(function (result) {
                                   var properties = {};
                                   if (Array.isArray(result.options)) {
                                       result.options.forEach(function (p) {
                                           if (!p.id) {
                                               p.id = p.name;
                                           }
                                           properties[p.id] = p;
                                       });
                                   }
                                   if (property === 'properties') {
                                       infoDeferred.resolve(properties);
                                   } else {
                                       if (property === 'description') {
                                           infoDeferred.resolve(result.shortDescription);
                                       } else {
                                           infoDeferred.resolve(result[property]);
                                       }
                                   }
                               }, function (error) {
                                   infoDeferred.reject(error);
                               });
                               return infoDeferred.promise;
                           };

                           var metadata = {
                              'name': app.name,
                              'group': 'apps',
                              'metadata': {
                                    'titleProperty': 'node-label'
                              },
                              'get' : get
                           };

                           if (!metamodel[metadata.group]) {
                               metamodel[metadata.group] = {};
                           }
                           metamodel[metadata.group][metadata.name] = metadata;
                       });

                   }
               });
               return promise;
            }

            // function loadTaskDefinitions(metamodel) {
            //    var taskDefinitionsPromise = taskDefinitionsService.getAllTaskDefinitions().$promise;
            //    taskDefinitionsPromise.then(function (result) {
            //        if (result && result._embedded && result._embedded.taskDefinitionResourceList &&
            //            Array.isArray(result._embedded.taskDefinitionResourceList)) {
            //            result._embedded.taskDefinitionResourceList.forEach(function(taskDefinition) {
            //                var metadata = {
            //                    'name':taskDefinition.name,
            //                    'group':'definitions',
            //                    'metadata': {
            //                        'titleProperty': 'node-label',
            //                        // 'noEditableProps': true
            //                    },
            //                    'get': function(property) {
            //                        var deferred = utils.$q.defer();
            //                        if (property === 'properties') {
            //                            deferred.resolve();
            //                        } else if (property === 'description') {
            //                            deferred.resolve(taskDefinition.dslText);
            //                        } else {
            //                            deferred.resolve();
            //                        }
            //                        return deferred.promise;
            //                    }
            //                };
            //                if (!metamodel[metadata.group]) {
            //                    metamodel[metadata.group] = {};
            //                }
            //                metamodel[metadata.group][metadata.name] = metadata;
            //            });
            //        }
            //    }, function (result) {
            //        utils.growl.error(result.data[0].message);
            //    });
            //    return taskDefinitionsPromise;
            // }

            function loadControlNodes(metamodel) {
                var deferred = utils.$q.defer();
                CONTROL_NODES_METADATA.forEach(function(metadata) {
                    metadata.get = function(property) {
                        var d = utils.$q.defer();
                        if (property === 'properties') {
                            d.resolve(metadata.properties);
                        } else if (property === 'description') {
                            d.resolve(metadata.shortDescription);
                        } else {
                            d.resolve();
                        }
                        return d.promise;
                    };
                    if (!metamodel[metadata.group]) {
                        metamodel[metadata.group] = {};
                    }
                    metamodel[metadata.group][metadata.name] = metadata;
                });
                deferred.resolve();
                return deferred.promise;
            }

            function loadLinks(metamodel) {
                var deferred = utils.$q.defer();
                var metadata = {
                    group: 'links',
                    name: 'link',
                    noPaletteEntry: true,
                    properties: {
                        'ExitStatus': {
                            'id': 'ExitStatus',
                            'name': 'Exit Status',
                            'defaultValue': '',
                            'description': 'Exit status triggering transition to alternate task flow route'
                        }
                    },
                    metadata: {
                        unselectable: true
                    },
                    // metadata: {
                    //     titleProperty: 'props/ExitStatus'
                    // },
                    get: function(property) {
                        var d = utils.$q.defer();
                        if (property === 'properties') {
                            d.resolve(this.properties);
                        } else if (property === 'description') {
                            d.resolve(this.shortDescription);
                        } else {
                            d.resolve();
                        }
                        return d.promise;
                    }
                };
                if (!metamodel[metadata.group]) {
                    metamodel[metadata.group] = {};
                }
                metamodel[metadata.group][metadata.name] = metadata;
                deferred.resolve();
                return deferred.promise;
            }

            /**
             * Loads and constructs the meta-model object
             * @returns {*} promise that's resolved to the meta-model object
             */
            function refresh() {
                listeners.forEach(function(listener) {
                    if (listener.metadataRefresh && listener.metadataRefresh.call) {
                        listener.metadataRefresh();
                    }
                });
                var deferred = utils.$q.defer();
                var newMetamodel = {};
                utils.$q.all([loadTaskApps(newMetamodel), /*loadTaskDefinitions(newMetamodel),*/ loadControlNodes(newMetamodel), loadLinks(newMetamodel)]).then(function() {
                    var change = {
                        newData: newMetamodel,
                        oldData: metamodel
                    };
                    metamodel = newMetamodel;
                    listeners.forEach(function(listener) {
                        if (listener.metadataChanged && listener.metadataChanged.call) {
                            listener.metadataChanged(change);
                        }
                    });
                    deferred.resolve(newMetamodel);
                }, function(data, status, headers, config) {
                    listeners.forEach(function(listener) {
                        if (listener.metadataError && listener.metadataError.call) {
                            listener.metadataError(data, status, headers, config);
                        }
                    });
                    deferred.reject(data);
                });
                return deferred.promise;
            }

            /**
             * Loads and constructs the meta-model object if it's not cached yet
             * @returns {*} promise that's resolved to the meta-model object
             */
            function load(force) {
                if (!request || force) {
                    request = refresh();
                }
                return request;
            }

            /*
             * Convert a graph from the internal format (the joint js graph) to the common format that
             * can be sent to the server for conversion into a new text representation. The common
             * format is the same as what we receive from the server when asking it to parse some
             * DSL text.
             */
            function toCommonGraphFormat(graphInInternalFormat) {
            	var elements = graphInInternalFormat.attributes.cells.models;
            	var nodes = [];
            	var links = [];
            	var globalOptions;
            	for (var i=0;i<elements.length;i++) {
            		var element = elements[i];
            		if (element.attributes.type === 'sinspctr.IntNode') {
            			var attrs= element.attributes.attrs;
            			var newNode = {};
            			newNode.name = attrs.metadata.name;
            			newNode.id = element.attributes.id;
            			if (element.attributes.attrs.props) {
            				if (newNode.name === 'START') {
            					// Global options are held on the START node during graph editing
            					globalOptions = element.attributes.attrs.props;
            				} else {
            					newNode.properties = element.attributes.attrs.props;
            					if (element.attr('node-label')) {
            					    newNode.metadata = {};
            					    newNode.metadata[COMPOSED_TASK_LABEL] = element.attr('node-label');
                                }
            				}
            			}
            			nodes.push(newNode);
            		}
            		else if (element.attributes.type === 'sinspctr.Link' || element.attributes.type === 'link') {
            			var newlink = {'from':element.attributes.source.id,'to':element.attributes.target.id};
            			if (element.attributes.attrs.metadata && element.attributes.attrs.props &&
            					element.attributes.attrs.props.ExitStatus) {
            				newlink.properties = {'transitionName':element.attributes.attrs.props.ExitStatus};
            			}
            			links.push(newlink);
            		}
            	}
            	var graph = {'nodes':nodes,'links':links};
            	if (globalOptions) {
            		graph.properties = globalOptions;
            	}
            	return graph;
            }

            /**
             * Transform errors received from the server into a form suitable
             * for attachment to the text.
             */
            function postProcessErrors(taskSpecificationText,errors) {
            	var linebreaks =[0];
        		var pos = 0;
        		// TODO windows LF handling?
        		while ((pos=taskSpecificationText.indexOf('\n',pos))!==-1) {
        			linebreaks.push(++pos);
        		}
        		var toPos = function(pos) {
        			for (var i=0;i<linebreaks.length;i++) {
        				if (pos>linebreaks[i]) { continue; }
        				else if (i > 0) {
                            return {'line':i-1,'ch':pos-linebreaks[i-1]};
                        }
        			}
        			var lastone = linebreaks.length-1;
        			return {'line':lastone,'ch':pos-linebreaks[lastone]};
        		};
            	var processedErrors = [];
				// Example errors:
				// SEVERE: {"message":"XD112E:(pos 5): Unexpectedly ran out of input\nbar |\n   * ^\n","position":5}
				// SEVERE: {"message":"XD100E:(pos 14): Found unexpected data after stream definition: 'log'\nmail |  wibbe log |\n             *^\n","position":14}					
				// SEVERE: {"message":"XD102E:(pos 20): No whitespace allowed after argument name and before =\nrofo | asdfa --name = var\n            *       ^\n","position":20}]
				for (var e =0;e<errors.length;e++) {
					var error = errors[e];

					var errorToRecord = null;
					var range;
					var errpos;
					if (error.accurate) {
						// If accurate is set then the message is already correct and needs no processing.
						// Accurate messages are produced by local processing.
						errorToRecord = error;
//					} else if (error.message.startsWith('Could not find module with name')) {
//						range = {'start':{'ch':0,'line':lineNumber},'end':{'ch':0,'line':lineNumber}};
//						// "Could not find module with name 'abcd'"
//						var moduleName = error.message.substring(error.message.indexOf('\'')+1);
//						moduleName = moduleName.substring(0,moduleName.indexOf('\''));
//						errpos = lineText.indexOf(moduleName);
//						if (lineText.indexOf(moduleName,errpos+1)!==-1) {
//							// occurring more than once, let's not be too clever for now, just mark the line
//						} else {
//							// only occurs once, this must be it!
//							range = {'start':{'ch':errpos,'line':lineNumber},'end':{'ch':errpos+moduleName.length,'line':lineNumber}};
//						}
//						// Have a go at finding the module - if it is unique we know we can point at the
//						// right now. If it isn't unique, they probably are all wrong !
//						errorToRecord = {'message':error.message,'range':range};
					} else if (error.message.startsWith('XD207E')) {
						errpos = error.position;
						range = {'start':toPos(errpos-1),'end':toPos(errpos)};
						errorToRecord = {'message':error.message,'range':range};
					} else if (error.message.startsWith('XD')) {
						errpos = error.position;
						range = {'start':toPos(errpos),'end':toPos(errpos+1)};
						errorToRecord = {'message':error.message,'range':range};
					} else {
					    //TODO: all errors are shown for now
                        errpos = error.position;
                        range = {'start':toPos(errpos),'end':toPos(errpos+1)};
                        errorToRecord = {'message':error.message,'range':range};
						// utils.$log.info('>>>>>> Did nothing with message: '+JSON.stringify(error));
					}
					if (errorToRecord) {
						utils.$log.info('updateGraphFn: Recording error '+JSON.stringify(errorToRecord));
						processedErrors.push(errorToRecord);
					}
				}
				return processedErrors;
            }
            
            function parseAndRefreshGraph(definitionsText,updateGraphFn,updateErrorsFn) {
                return $http.post('/tools/parseTaskTextToGraph', { dsl: definitionsText || ' ', name: 'unknown' }).success(function(result) {
	      			// result may have graph/error entries
	      			utils.$log.info('updateGraphFn: successful parse call: '+JSON.stringify(result));
	      			//result = JSON.parse(result);
	      			if (updateErrorsFn && updateErrorsFn.call) {
						updateErrorsFn(null);
					}
	    			// If there is no data, don't bother processing the response. Ideally the request would not be made
	    			// but handling it like this involves building less promises.
	    			if (definitionsText.trim().length===0) {
	    				utils.$log.info('UpdateGraphFn: no definition');
						if (updateGraphFn && updateGraphFn.call) {
							updateGraphFn({'format': 'batch', 'nodes': [], 'links': []});
						}
	    				return;
	    			}
	    			
	    			var graphAndError = result;
	    			
	    			// updateGraphFn(graphAndError.graph);
	    			if (graphAndError.errors && graphAndError.errors.length!==0) {
						if (updateErrorsFn && updateErrorsFn.call) {
							var errors = graphAndError.errors.slice();
							if (graphAndError.graph && graphAndError.graph.errors) {
								errors.push(graphAndError.graph.errors);
							}
							updateErrorsFn(postProcessErrors(definitionsText,errors));
						}
	    			}
	    			if (graphAndError.graph) {
	    				utils.$log.info('Computed graph is '+JSON.stringify(graphAndError.graph));
						if (updateGraphFn && updateGraphFn.call) {
							updateGraphFn(graphAndError.graph);
						}
	    			}
	    		}).error(function(data, status, headers, config, statusText) {
	      			utils.$log.info('failed parse call');
	    			// if (typeof data === 'string') {
	    			// 	data = angular.fromJson(data);
	    			// }
					if (updateErrorsFn && updateErrorsFn.call) {
						updateErrorsFn(data);
					}
	    			utils.$log.info(statusText);
	    			
    				utils.$log.info(JSON.stringify(data));
	    		});
    		}

    		/**
    		 * Take the JSON description of the flow as provided by the server and map it into a series
    		 * of nodes that can be processed by dagre/joint.
    		 */
    		function buildGraphFromJson(flo, jsonFormatData, metamodel) {
    			var inputnodes = jsonFormatData.nodes;
    			var inputlinks = jsonFormatData.links;

    			var incoming = {};
    			var outgoing = {};
    			var link;
    			for (var i = 0; i < inputlinks.length; i++) {
    				link = inputlinks[i];
    				if (typeof link.from === 'number') {
    					if (typeof outgoing[link.from] !== 'number') {
    						outgoing[link.from] = 0;
    					}
    					outgoing[link.from]++;
    				}
    				if (typeof link.to === 'number') {
    					if (typeof incoming[link.to] !== 'number') {
    						incoming[link.to] = 0;
    					}
    					incoming[link.to]++;
    				}
    			}

    			var inputnodesCount = inputnodes ? inputnodes.length : 0;
    			var nodesIndex = [];
    			var builtNodesMap = {};
    			for (var n = 0; n < inputnodesCount; n++) {
    				var name = inputnodes[n].name;
    				var label = inputnodes[n].label || inputnodes[n].name;
    				var group = inputnodes[n].group;
    				if (!group) {
    					group = metamodelUtils.matchGroup(metamodel, name, incoming[n], outgoing[n]);
    				}
                    var metadata = metamodelUtils.getMetadata(metamodel, name, group);
                    if (metadata.unresolved) {
                        metadata.metadata = {
                            titleProperty: 'metadata/name'
                        };
                    }
                    var nodeProperties = inputnodes[n].properties;
                    var metadataProperties = inputnodes[n].metadata;
					// Put the global properties onto the start node if there are any
    				if (n === 0 && name === 'START' && jsonFormatData.properties) {
    					nodeProperties = jsonFormatData.properties;
    				}
    				var newNode = flo.createNode(metadata, nodeProperties/*, {x: -200, y: -200}*/);
    				// Hang the properties off the start node!
    				newNode.attr('.label/text', label);
    				if (inputnodes[n].range) {
    					newNode.attr('range', inputnodes[n].range);
    				}
    				if (inputnodes[n].propertiesranges) {
    					newNode.attr('propertiesranges', inputnodes[n].propertiesranges);
    				}
    				if (inputnodes[n]['stream-id']) {
    					newNode.attr('stream-id', inputnodes[n]['stream-id']);
    				}
    				if (metadataProperties && metadataProperties[COMPOSED_TASK_LABEL]) {
    				    newNode.attr('node-label', metadataProperties[COMPOSED_TASK_LABEL]);
                    }
    				nodesIndex.push(newNode.id);
    				builtNodesMap[inputnodes[n].id] = newNode.id;
    			}
//    			var nextId = inputnodesCount; // For dropped nodes, they will start getting this ID

    			var inputlinksCount = inputlinks ? inputlinks.length : 0;
//    			utils.$log.info('Links ' + inputlinksCount);
    			for (var l = 0; l < inputlinksCount; l++) {
    				link = inputlinks[l];
    				var props = {};
    				if (link.properties) {
    					// Copy the transitionName from the properties in the JSON form
    					// as task exit status in the built link
    					props.ExitStatus = link.properties.transitionName;
    				}
    				// TODO safe to delete from/to/nodesIndex now?
//    				var from = { 'id': nodesIndex[link.from], 'selector': '.output-port' };
//    				var to = { 'id': nodesIndex[link.to], 'selector': '.input-port' };
    				var otherfrom = { 'id': builtNodesMap[link.from], 'selector': '.output-port'};
    				var otherto = { 'id': builtNodesMap[link.to], 'selector': '.input-port'};
//    				utils.$log.info("OLD from="+JSON.stringify(from)+" to="+JSON.stringify(to));
//    				utils.$log.info("NEW from="+JSON.stringify(otherfrom)+" to="+JSON.stringify(otherto));
    				flo.createLink(otherfrom,otherto,metamodelUtils.getMetadata(metamodel,'link','links'),props);
    			}

    			flo.performLayout();

                // Graph is empty? Ensure there are at least start and end nodes created!
                var promise = nodesIndex.length ? flo.performLayout() : flo.clearGraph();

                if (promise && promise.then && promise.then.call) {
                    promise.then(function() {
                        flo.fitToPage();
                    });
                } else {
                    flo.fitToPage();
                }

    		}

            function textToGraph(flo, definition) {
                return parseAndRefreshGraph(definition.text, function(json) {
                    flo.getGraph().clear();
                    load().then(function(metamodel) {
                        buildGraphFromJson(flo, json, metamodel);
                    });
                },function(errors) {
                    definition.parseError = errors;
                });
            }

            /**
             * Convert the graph to a common format then send it to the server to
             * be converted to DSL text. Then update the text box with this new
             * text.
             */
            function graphToText(flo, definition) {
                var deferred = utils.$q.defer();
                var graphInInternalFormat = flo.getGraph();
                var graphInCommonFormat = toCommonGraphFormat(graphInInternalFormat);
                utils.$log.info('Graph for conversion to DSL text: '+JSON.stringify(graphInCommonFormat));
                $http.post('/tools/convertTaskGraphToText', graphInCommonFormat).success(function(response) {
                    // result may have text/error entries
                    utils.$log.info('graphToText: successful convert call: '+JSON.stringify(response));
                    if (response.dsl !== undefined) {
                        definition.text = response.dsl;
                    }
                    deferred.resolve(definition.text);
                    definition.parseErrors = null;
                    if (response.errors && angular.isArray(response.errors)) {
                        definition.parseError = postProcessErrors(definition.text, response.errors);
                    }
                }).error(function(data, status, headers, config, statusText) {
                    utils.$log.info('failed conversion call');
                    utils.$log.info(statusText);
                    utils.$log.info(JSON.stringify(data));
                    deferred.reject(data);
                });
                return deferred.promise;
            }

            /**
             * Service object. See the comments for individual functions above.
             */
            return {
                subscribe: subscribe,
                unsubscribe: unsubscribe,
                groups: groups,
                refresh: refresh,
                load: load,
                textToGraph: textToGraph,
                graphToText: graphToText,
                parseAndRefreshGraph: parseAndRefreshGraph
            };

        }];

});
