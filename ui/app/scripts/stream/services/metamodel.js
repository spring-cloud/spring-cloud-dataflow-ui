/*
 * Copyright 2015-2016 the original author or authors.
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

define(function (require) {

    'use strict';

    var keepAllProperties = false; // TODO address when whitelisting properties fixed in SCDF

    // Default icons (unicode chars) for each group member, unless they override
    var groupIcons = {
        'source': '⤇',// 2907
        'processor': 'λ', // 3bb  //flux capacitor? 1D21B
        'sink': '⤇', // 2907
        'task': '☉',//2609   ⚙=2699 gear (rubbish)
        'destination': '⦂', // 2982
        'tap': '⦂' // 2982
    };

    var DEBUG = false;

    var convertGraphToText = require('./graph-to-text');

    return ['$http', 'XDUtils', 'ModuleService', 'ParserService', 'createMetamodel',
        function ($http, utils, ModuleService, ParserService, createMetamodel) {

            // Pre ES6 browsers don't have 'startsWith' function, hence add it if necessary
            // TODO: remove in the future
            if (typeof String.prototype.startsWith !== 'function') {
                String.prototype.startsWith = function (s) {
                    return this.slice(0, s.length) === s;
                };
            }

            var Pageable = require('model/pageable');

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
            
            var mapOfSpecialProperties = {
                'http':['^server.port$'],
                'jdbc':['^spring\.datasource\..*'],
                'jms':['^spring\.jms\..*'],
                'rabbit':['^spring\.rabbitmq\..*']                                
            };
            
            /**
             * Special properties are dotted boot properties that particular modules utilise. This
             * handling is here until the infrastructure offers a proper whitelisting mechanism. 
             */
            function isSpecialProperty(nodeName,propertyName) {
                var hasSpecialProperties = mapOfSpecialProperties[nodeName];
                if (hasSpecialProperties) {
                    for (var i=0;i<hasSpecialProperties.length;i++) {
                        if (propertyName.search(hasSpecialProperties[i])!==-1) {
                            return true;
                        }
                    }
                }
                return false;
            }

            function createMetadata(node) {
                if (node.name !== 'tap' && node.name !== 'destination') {
                    node.metadata = {
                        titleProperty: 'node-name',
                        'unicodeChar': '\u21d2'
                    };
                }

                // Set up constraints only to get metadata.matchGroup() function to work correctly
                var constraints;
                if (node.group === 'source') {
                    constraints = { maxIncomingLinksNumber: 0 };
                } else if (node.group === 'sink') {
                    constraints = { maxOutgoingLinksNumber: 0 };
                } else if (node.group === 'processor') {
                    constraints = { maxIncomingLinksNumber: 1 };
                }

                if (groupIcons[node.group]) {
                    node.metadata.unicodeChar = groupIcons[node.group];
                }

                var get;
                // TODO could make this more flexible, some property on a node we could check if further metadata might be fetchable
                if (node.group === 'job' || node.group === 'other' || node.group === 'job definition') {
                    get = function (property) {
                        var deferred = utils.$q.defer();
                        deferred.resolve(node[property]);
                        return deferred.promise;
                    };
                } else {
                    var infoPromise;
                    get = function (property) {
                        if (!infoPromise) {
                            infoPromise = ModuleService.getModuleInfo(node.group, node.name);
                        }
                        var deferred = utils.$q.defer();
                        infoPromise.then(function (result) {
                            var properties = {};
                            if (Array.isArray(result.data.options)) {
                                result.data.options.forEach(function (p) {
                                    // An interesting property is not dotted and is not 'debug' or 'info'
                                    var interestingProperty = p.id.indexOf('.')===-1  && p.id!=='debug' && p.id!=='info';
                                    if (keepAllProperties || interestingProperty || isSpecialProperty(node.name,p.id)) {
                                        p.name = p.id;
                                        properties[p.id] = p;
                                    }
                                    if (p.sourceType === 'org.springframework.cloud.stream.app.transform.ProgrammableRxJavaProcessorProperties') {
                                        if (p.id === 'code') {
                                            p.contentType = 'java';
                                        }
                                    } else if (p.sourceType === 'org.springframework.cloud.stream.app.scriptable.transform.processor.ScriptableTransformProcessorProperties') {
                                        if (p.id === 'script') {
                                            p.contentType = 'Plain Text';
                                            p.contentTypeProperty = 'language';
                                        } else if (p.id === 'language') {
                                            p.options = ['groovy', 'javascript', 'ruby', 'python'];
                                        }
                                    }
                                });
                            }
                            if (properties.language && properties.script) {
                                properties.script.source = {
                                    type: properties.language.defaultValue,
                                    mime: 'text/x-' + properties.language.defaultValue
                                };
                            }
                            if (properties.code) {
                                properties.code.source = {
                                    type: 'java',
                                    mime: 'text/x-java'
                                };
//                            properties.code.description = 'Return should map from Observable to Observable';
                            }
                            if (property === 'properties') {
                                deferred.resolve(properties);
                            } else {
                                if (property === 'description') {
                                    deferred.resolve(result.data.shortDescription);
                                } else {
                                    deferred.resolve(result.data[property]);
                                }
                            }
                        }, function (error) {
                            deferred.reject(error);
                        });
                        return deferred.promise;
                    };
                }

                return {
                    name: node.name,
                    group: node.group,
                    icon: node.icon,
                    metadata: node.metadata,
                    constraints: constraints,
                    get: get
                };
            }

            function loadOtherIntoPalette(metamodel) {
                metamodel.typeToDataMap.other = {
                    'tap': createMetadata({
                        'name': 'tap',
                        'group': 'other',
                        'description': 'Tap into an existing module',
                        'metadata': {
                            /*'titleProperty': 'stream-name',*/
                            'hide-tooltip-options': true,
                            'unicodeChar': '⦂'
                        },
                        'properties': {
                            'name': {
                                'name': 'Source Destination Name',
                                'id': 'name',
                                'defaultValue': '',
                                'description': 'the identifier of the producer endpoint in a stream in the form <stream-name>.<module/app-name>',
                                'pattern': '[\\w_]+[\\w_-]*\\.[\\w_]+[\\w_-]*'
                            }
                        }
                    }),
                    'destination': createMetadata({
                        'name': 'destination',
                        'metadata': {'fixed-name': true, 'unicodeChar': '⦂'},
                        'description': 'A destination channel that can be used as a source or a sink',
                        'group': 'other',
                        'properties': {
                            'name': {
                                'name': 'name',
                                'id': 'name',
                                'defaultValue': '',
                                'description': 'the input/output destination name',
                                'pattern': '[\\w_]+[\\w_-]*'
                            }
                        }
                    })
                };
            }

            function loadPageIntoPalette(pageNumber, metamodel) {
                var pageable = new Pageable();
                pageable.pageNumber = pageNumber;
                loadOtherIntoPalette(metamodel);
                var moduleDefinitionsPromise = ModuleService.getDefinitions(pageable).$promise;
                return moduleDefinitionsPromise.then(function (result) {
                    var modules;
                    if (!!result._embedded) {
                        modules = result._embedded.moduleRegistrationResourceList;
                    }
                    if (modules) {
                        for (var i = 0; i < modules.length; i++) {
                            var module = modules[i];
                            if (module.type === 'job') {
                                // Don't include jobs, include job definitions (added later)
                                continue;
                            }
                            if (module.type === 'task') { // Don't include Tasks!
                                continue;
                            }
                            var icon;
                            if (module.type === 'sink') {
                                icon = 'images/icons/xd/sink.png';
                            } else if (module.type === 'source') {
                                icon = 'images/icons/xd/source.png';
                            } else if (module.type === 'processor') {
                                icon = 'images/icons/xd/transform.png';
                            }
                            // If specific icon provided, use it
//            			if (iconMap[module.name]) {
//            				icon = iconMap[module.name];
//            			}
                            var entry = {'name': module.name, 'group': module.type};
                            if (icon) {
                                entry.icon = icon;
                            }
                            var metadata = createMetadata(entry);
                            if (!metamodel.typeToDataMap[metadata.group]) {
                                metamodel.typeToDataMap[metadata.group] = {};
                            }
                            metamodel.typeToDataMap[metadata.group][metadata.name] = metadata;
                        }
                    }
                    if (pageNumber < (result.page.totalPages - 1)) {
                        return loadPageIntoPalette(pageNumber + 1, metamodel);
                    } else {
                        // finished loading modules, let's load job definitions
                        //return loadJobDefinitionPageIntoPalette(0, metamodel);
                    }
                }, function (result) {
                    utils.growl.error(result.data[0].message);
                });
            }

            function convertParseResponseToGraph(definitionsText, parsedDefinitions) {
                // Compute line breaks
                var linebreaks = [0];
                var pos = 0;
                // TODO windows LF handling?
                while ((pos = definitionsText.indexOf('\n', pos)) !== -1) {
                    linebreaks.push(++pos);
                }
                var streamModulesToIds = {}; // foo.bar=99

                // The result should look like this:
                // {errors:[...], graph:{format:.., streamdefs:[...], nodes:[...], links:[...]}

                var errors = [];

                // streamdefs look like this: {"name":"foo","def":" mail | transform --expression=payload.toString() | log"},
                var streamdefs = [];

                // nodes look like this: {"id":0,"name":"mail","stream-name":"foo","stream-id":1},
                var nodes = [];

                // links look like this: {"from":0,"to":1},
                var links = [];

                var nodeId = 0;
                var streamNumber = 1;
                var lineNumber = 0; // which line of text is being processed
                // streamNumber/lineNumber may not increment at the same rate when there is broken input text
                while (parsedDefinitions.lines && parsedDefinitions.lines.length !== 0) {
                    // Process a line
                    var lineText = definitionsText.substring(linebreaks[lineNumber], linebreaks[lineNumber + 1]);
                    // Example line: {"errors":null,"success":[{"label":"mail","type":"source","name":"mail","options":{},"sourceChannelName":null,"sinkChannelName":null},{"label":"log","type":"sink","name":"log","options":{},"sourceChannelName":null,"sinkChannelName":null}]}
                    var line = parsedDefinitions.lines.shift();
                    var streamName = '';
                    var streamdef = '';
                    //var streamStartNodeId = nodeId;
                    var nameSet = false;
                    utils.$log.info('convertParseResponseToGraph: Line#' + streamNumber + ': ' + JSON.stringify(line));

                    // Build the graph/links if there was successfully parsed output
                    var parsedNodes = line.success;
                    if (parsedNodes) {
                        var linkFrom = -1;
                        for (var n = 0; n < parsedNodes.length; n++) {
                            var linkType = null;
                            // Example node:
                            // {"label":"mail","type":"source","name":"mail","options":{},"sourceChannelName":null,"sinkChannelName":null}
                            var parsedNode = parsedNodes[n];
                            var graphNode = null;
                            var channelText;
                            var newlink;
                            // check for sourceChannelName
                            if (parsedNode.sourceChannelName) {
                                channelText = parsedNode.sourceChannelName;
                                if (channelText.startsWith('tap:')) { // TAP SOURCE
                                    var tappedDestination = channelText.substring(4);
                                    // Is it a tap on a stream already seen?
                                    var alreadyAllocated = streamModulesToIds[tappedDestination];
                                    if (DEBUG) {
                                        utils.$log.debug('Processing tap: ' + channelText + ' alreadyAllocated=' + alreadyAllocated);
                                        utils.$log.debug(JSON.stringify(streamModulesToIds));
                                    }
                                    if (typeof alreadyAllocated !== 'undefined') {
                                        // No node for this tap, link from the already existing module to the next node
                                        linkFrom = alreadyAllocated;
                                        linkType = 'tap';
                                    } else {
                                        // Create new node
                                        var tapName = parsedNode.sourceChannelName.substring(4);
                                        graphNode = {'id': nodeId++, 'name': 'tap', 'properties': {'name': tapName}};
                                        linkFrom = graphNode.id;
                                    }
                                } else { // DESTINATION SOURCE
                                    graphNode = {
                                        'id': nodeId++,
                                        'name': 'destination',
                                        'properties': {'name': parsedNode.sourceChannelName}
                                    };
                                    linkFrom = graphNode.id;
                                }
                                if (graphNode) {
                                    if (parsedNode.group) {
                                        nameSet = true;
                                        streamName = parsedNode.group;
                                        if (!streamName.startsWith('UNKNOWN_')) {
                                            graphNode['stream-name'] = parsedNode.group;
                                        }
                                        graphNode['stream-id'] = streamNumber++;
                                    }
                                    nodes.push(graphNode);
                                }
                                if (channelText.startsWith('tap:')) {
                                    channelText = channelText.substring(3); //TODO tidy up - do it here or sooner?
                                }
                                streamdef = channelText + ' > ';
                            }

                            // Definitions like ":foo > :bar" results in a bridge node with channels set - do not create
                            // a node for the bridge.
                            // Constructs like 'tap:stream:foo >' use a module with undefined name to hang the channel off (the node isn't real, don't build graph elements for it)
                            if (!(parsedNode.sourceChannelName && parsedNode.sinkChannelName && parsedNode.name === 'bridge') &&
                                parsedNode.name) {
                                if (n > 0) {
                                    streamdef = streamdef + '| ';
                                }
                                graphNode = {'id': nodeId++, 'label': parsedNode.label, 'name': parsedNode.name};
                                if (linkFrom !== -1) {
                                    newlink = {'from': linkFrom, 'to': graphNode.id};
                                    if (linkType) {
                                        newlink.linkType = linkType;
                                    }
                                    links.push(newlink);
                                }
                                linkFrom = graphNode.id;
                                if (!nameSet && parsedNode.group) {
                                    nameSet = true;
                                    streamName = parsedNode.group;
                                    if (!streamName.startsWith('UNKNOWN_')) {
                                        graphNode['stream-name'] = parsedNode.group;
                                    }
                                    graphNode['stream-id'] = streamNumber++;
                                }
                                if (nameSet) {
                                    streamModulesToIds[streamName + '.' + (parsedNode.label ? parsedNode.label : graphNode.name)] = graphNode.id;
                                }
                                if (parsedNode.label) {
                                    streamdef = streamdef + parsedNode.label + ': ';
                                }
                                streamdef = streamdef + graphNode.name + ' ';
                                if (!_.isEmpty(parsedNode.options)) {
                                    graphNode.properties = parsedNode.options;
                                    graphNode.propertiesranges = parsedNode.optionsranges;
                                    for (var key in graphNode.properties) {
                                        if (graphNode.properties.hasOwnProperty(key)) {
                                            streamdef = streamdef + '--' + key + '=' + graphNode.properties[key] + ' ';
                                        }
                                    }
                                }
                                if (parsedNode.range) {
                                    graphNode.range = parsedNode.range;
                                }
                                nodes.push(graphNode);
                            }

                            if (parsedNode.sinkChannelName) {
                                channelText = parsedNode.sinkChannelName;
//    						if (parsedNode.sinkChannelName.startsWith('job:')) {
//    							// A job output channel should be represented by a job node
//								graphNode = { 'id':nodeId++,'name':parsedNode.sinkChannelName.substring(4),'properties':{}};
//								sinkchannel='queue:'+sinkchannel;
//    						} else {
                                // assert n==parsedNodes.length-1
                                graphNode = {
                                    'id': nodeId++,
                                    'name': 'destination',
                                    'properties': {'name': channelText}
                                };
                                if (linkFrom !== -1) {
                                    newlink = {'from': linkFrom, 'to': graphNode.id};
                                    if (linkType) {
                                        newlink.linkType = linkType;
                                    }
                                    links.push(newlink);
                                }
                                linkFrom = graphNode.id;
//    						}
                                nodes.push(graphNode);
                                if (!parsedNode.sourceChannelName) {
                                    // if it is a bridge then the source channel already added a '>'
                                    streamdef = streamdef + ' > ';
                                }
                                streamdef = streamdef + channelText;
                            }

                        }

                        if (streamName.startsWith('UNKNOWN_')) {
                            streamName = '';
                        }
                        // Create streamdef
                        streamdefs.push({'name': streamName, 'def': streamdef.trim()});

                        // Create links
//    				for (var l=streamStartNodeId;l<(nodeId-1);l++) {
//    					links.push({'from':l,'to':(l+1)});
//    				}
                    }

                    if (line.errors) {
                        // Example errors:
                        // VALIDATION: {"message":"Could not find module with name 'bo' and type among [processor, sink]","position":null}
                        // SEVERE: {"message":"XD112E:(pos 5): Unexpectedly ran out of input\nbar |\n   * ^\n","position":5}
                        // SEVERE: {"message":"XD100E:(pos 14): Found unexpected data after stream definition: 'log'\nmail |  wibbe log |\n             *^\n","position":14}
                        // SEVERE: {"message":"XD102E:(pos 20): No whitespace allowed after argument name and before =\nrofo | asdfa --name = var\n            *       ^\n","position":20}]
                        for (var e = 0; e < line.errors.length; e++) {
                            var error = line.errors[e];

                            var errorToRecord = null;
                            var range;
                            var errpos;
                            if (error.accurate) {
                                // If accurate is set then the message is already correct and needs no processing.
                                // Accurate messages are produced by the local parse.
                                errorToRecord = error;
                            } else if (error.message.startsWith('Could not find module with name')) {
                                range = {'start': {'ch': 0, 'line': lineNumber}, 'end': {'ch': 0, 'line': lineNumber}};
                                // "Could not find module with name 'abcd'"
                                var moduleName = error.message.substring(error.message.indexOf('\'') + 1);
                                moduleName = moduleName.substring(0, moduleName.indexOf('\''));
                                errpos = lineText.indexOf(moduleName);
                                if (lineText.indexOf(moduleName, errpos + 1) !== -1) {
                                    // occurring more than once, let's not be too clever for now, just mark the line
                                } else {
                                    // only occurs once, this must be it!
                                    range = {
                                        'start': {'ch': errpos, 'line': lineNumber},
                                        'end': {'ch': errpos + moduleName.length, 'line': lineNumber}
                                    };
                                }
                                // Have a go at finding the module - if it is unique we know we can point at the
                                // right now. If it isn't unique, they probably are all wrong !
                                errorToRecord = {'message': error.message, 'range': range};
                            } else if (error.message.startsWith('XD112E')) {
                                errpos = error.position;
                                range = {
                                    'start': {'ch': errpos - 1, 'line': lineNumber},
                                    'end': {'ch': errpos, 'line': lineNumber}
                                };
                                errorToRecord = {'message': error.message, 'range': range};
                            } else if (error.message.startsWith('XD1')) {
                                errpos = error.position;
                                range = {
                                    'start': {'ch': errpos, 'line': lineNumber},
                                    'end': {'ch': errpos + 1, 'line': lineNumber}
                                };
                                errorToRecord = {'message': error.message, 'range': range};
                            } else {
                                utils.$log.info('>>>>>> Did nothing with message: ' + JSON.stringify(error));
                            }
                            if (errorToRecord) {
                                utils.$log.info('updateGraphFn: Recording error ' + JSON.stringify(errorToRecord));
                                errors.push(errorToRecord);
                            }
                        }
                    }
                    lineNumber++;
                }
                var graphAndErrors = {'errors': errors};
                if (nodes.length !== 0) {
                    graphAndErrors.graph = {'format': 'scdf', 'streamdefs': streamdefs, 'nodes': nodes, 'links': links};
                }
                return graphAndErrors;
            }

            function parseAndRefreshGraph(definitionsText, updateGraphFn, updateErrorsFn) {
                if (updateErrorsFn && updateErrorsFn.call) {
                    updateErrorsFn(null);
                }
                if (definitionsText.trim().length === 0) {
                    utils.$log.info('UpdateGraphFn: no definition');
                    if (updateGraphFn && updateGraphFn.call) {
                        updateGraphFn({'format': 'xd', 'streamdefs': [], 'nodes': [], 'links': []});
                    }
                    return;
                }
                var parsedStreamData = ParserService.parse(definitionsText);
                var graphAndErrors = convertParseResponseToGraph(definitionsText, parsedStreamData);
                if (graphAndErrors.errors.length !== 0) {
                    if (updateErrorsFn && updateErrorsFn.call) {
                        updateErrorsFn(graphAndErrors.errors);
                    }
                }
                if (graphAndErrors.graph) {
                    utils.$log.info('UpdateGraphFn: Computed graph is ' + JSON.stringify(graphAndErrors.graph));
                    if (updateGraphFn && updateGraphFn.call) {
                        updateGraphFn(graphAndErrors.graph);
                    }
                } else {
                    // Not doing anything here means the existing graph stays around even though there is
                    // a problem with the text right now. If they fix the text then a proper graph will
                    // get displayed.
                }
            }

            /**
             * Take the JSON description of the flow as provided by the parser and map it into a series
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
                for (var n = 0; n < inputnodesCount; n++) {
                    var name = inputnodes[n].name;
                    var label = inputnodes[n].label;
                    var group = inputnodes[n].group;
                    if (!group) {
                        group = metamodel.matchGroup(name, incoming[n], outgoing[n]);
                    }
                    var newNode = flo.createNewNode(metamodel.getMetadata(name, group), inputnodes[n].properties);
                    // Tap and Destination names are in 'props/name' property
                    if (name !== 'tap' && name !== 'destination') {
                        newNode.attr('node-name', label);
                    }
                    var streamname = inputnodes[n]['stream-name'];
                    if (streamname) {
                        newNode.attr('stream-name', streamname);
                    }
                    if (inputnodes[n].range) {
                        newNode.attr('range', inputnodes[n].range);
                    }
                    if (inputnodes[n].propertiesranges) {
                        newNode.attr('propertiesranges', inputnodes[n].propertiesranges);
                    }
                    if (inputnodes[n]['stream-id']) {
                        newNode.attr('stream-id', inputnodes[n]['stream-id']);
                    }

                    nodesIndex.push(newNode.id);
                }

                var inputlinksCount = inputlinks ? inputlinks.length : 0;
                for (var l = 0; l < inputlinksCount; l++) {
                    link = inputlinks[l];
                    if (link.linkType && link.linkType === 'tap') {
                        flo.createNewLink({'id': nodesIndex[link.from], 'selector': '.tap-port', 'port': 'tap'},
                            {'id': nodesIndex[link.to], 'selector': '.input-port', 'port': 'input'});
                    } else {
                        flo.createNewLink({
                                'id': nodesIndex[link.from],
                                'selector': '.output-port',
                                'port': 'output'
                            },
                            {'id': nodesIndex[link.to], 'selector': '.input-port', 'port': 'input'});
                    }
                }

                flo.resetLayout();
                flo.fitToPage();
            }

            function isValidPropertyValue(model, property, value) {
                var type = model.attr('metadata/name');
                if (type === 'tap' && property === 'channel') {
                    return value.indexOf('tap:stream:') === 0 || value.indexOf('tap:job:') === 0;
                }
                if (type === 'named-channel' && property === 'channel') {
                    return value.indexOf('queue:') === 0 || value.indexOf('topic:') === 0;
                }
                return true;
            }

            function encodeTextToDSL(value) {
                var retval = '\"' + value.replace(/(?:\r\n|\r|\n)/g, '\\n').replace(/"/g, '""') + '\"';
                return retval;
            }

            function decodeTextFromDSL(value) {
                if (value.charAt(0) === '\"' && value.charAt(value.length - 1) === '\"') {
                    value = value.substr(1, value.length - 2);
                }
                var retval = value.replace(/\\n/g, '\n').replace(/\"\"/g, '"');
                return retval;
            }


            /**
             * Loads and constructs the meta-model object
             * @returns {*} promise that's resolved to the meta-model object
             */
            function refresh() {
                listeners.forEach(function (listener) {
                    if (listener.metadataRefresh && listener.metadataRefresh.call) {
                        listener.metadataRefresh();
                    }
                });
                var deferred = utils.$q.defer();
                var newMetamodel = createMetamodel({});
                loadPageIntoPalette(0, newMetamodel).then(function () {
                    var change = {
                        newData: newMetamodel,
                        oldData: metamodel
                    };
                    metamodel = newMetamodel;
                    listeners.forEach(function (listener) {
                        if (listener.metadataChanged && listener.metadataChanged.call) {
                            listener.metadataChanged(change);
                        }
                    });
                    deferred.resolve(newMetamodel);
                }, function (data, status, headers, config) {
                    listeners.forEach(function (listener) {
                        if (listener.metadataError && listener.metadataError.call) {
                            listener.metadataError(data, status, headers, config);
                        }
                    });
                    deferred.reject(data);
                });
                request = deferred.promise;
                return request;
            }

            /**
             * Loads and constructs the meta-model object if it's not cached yet
             * @returns {*} promise that's resolved to the meta-model object
             */
            function load() {
                if (!request) {
                    refresh();
                }
                return request;
            }

            function textToGraph(flo, definition) {
                return parseAndRefreshGraph(definition.text, function (json) {
                    flo.getGraph().clear();
                    load().then(function (metamodel) {
                        buildGraphFromJson(flo, json, metamodel);
                    });
                }, function (errors) {
                    definition.parseError = errors;
                });
            }

            function graphToText(flo, definition) {
                definition.text = convertGraphToText(flo.getGraph());
                return utils.$timeout(function () {
                    return parseAndRefreshGraph(definition.text, null, function (errors) {
                        definition.parseError = errors;
                    });
                });
            }

            /**
             * Service object. See the comments for individual functions above.
             */
            return {
                subscribe: subscribe,
                unsubscribe: unsubscribe,
                refresh: refresh,
                load: load,
                textToGraph: textToGraph,
                graphToText: graphToText,
                convertParseResponseToGraph: convertParseResponseToGraph,
                isValidPropertyValue: isValidPropertyValue,
                encodeTextToDSL: encodeTextToDSL,
                decodeTextFromDSL: decodeTextFromDSL,
                convertGraphToText: convertGraphToText
            };

        }];

});
