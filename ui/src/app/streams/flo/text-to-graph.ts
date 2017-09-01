/*
 * Copyright 2015-2017 the original author or authors.
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

import { Flo } from 'spring-flo';
import { dia } from 'jointjs';
import * as _ from 'lodash';
import { Parser } from '../../shared/services/parser';
import { MetamodelService } from './metamodel.service';


/**
 * Build a graph representation from text dsl.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class TextToGraphConverter {

    constructor(private dsl: string, private floEditorContext: Flo.EditorContext,
                private metamodel:  Map<string, Map<string, Flo.ElementMetadata>>) {
    }

    // private parseToJson(definitionsText, updateGraphFn, updateErrorsFn) {
    // 	updateErrorsFn(null);
    // 	if (definitionsText.trim().length === 0) {
    // 		console.log('UpdateGraphFn: no definition');
    // 		updateGraphFn({'format': 'xd', 'streamdefs': [], 'nodes': [], 'links': []});
    // 		return;
    // 	}
    // 	var lines: Lines = parse(this.dsl, 'stream');

    // 	var parsedStreamData = ParserService.parse(definitionsText);
    // 	var graphAndErrors = convertParseResponseToGraph(definitionsText, parsedStreamData);
    // 	if (graphAndErrors.errors.length !== 0) {
    // 		updateErrorsFn(graphAndErrors.errors);
    // 	}
    // 	if (graphAndErrors.graph) {
    // 		console.log('UpdateGraphFn: Computed graph is ' + JSON.stringify(graphAndErrors.graph));
    // 		updateGraphFn(graphAndErrors.graph);
    // 	} else {
    // 		// Not doing anything here means the existing graph stays around even though there is
    // 		// a problem with the text right now. If they fix the text then a proper graph will
    // 		// get displayed.
    // 	}
    // }
    static parseToJsonGraph(dsl: string): JsonGraph.Graph {
        if (!dsl || dsl.trim().length === 0) {
            console.log('parseToJson: no text to parse');
            return {'errors': null, 'format': 'xd', 'streamdefs': [], 'nodes': [], 'links': []};
        } else {
            const parsedStreams: Parser.ParseResult = Parser.parse(dsl, 'stream');
            return this.convertParseResponseToJsonGraph(dsl, parsedStreams).graph;
        }
    }


    // var graphAndErrors = convertParseResponseToGraph(definitionsText, parsedStreamData);
    // if (graphAndErrors.errors.length !== 0) {
    // 	updateErrorsFn(graphAndErrors.errors);
    // }
    // if (graphAndErrors.graph) {
    // 	console.log('UpdateGraphFn: Computed graph is ' + JSON.stringify(graphAndErrors.graph));
    // 	updateGraphFn(graphAndErrors.graph);
    // } else {
    // 	// Not doing anything here means the existing graph stays around even though there is
    // 	// a problem with the text right now. If they fix the text then a proper graph will
    // 	// get displayed.
    // }


    static findExistingDestinationNode(nodes, name) {
        for (let n = 0; n < nodes.length; n++) {
            const node = nodes[n];
            if (node.name && node.name === 'destination') {
                if (node.properties && node.properties.name && node.properties.name === name) {
                    return node;
                }
            }
        }
        return null;
    }

    static convertParseResponseToJsonGraph(dsl: string, parsedStreams: Parser.ParseResult): JsonGraph.GraphHolder {
        // Compute line breaks
        const linebreaks = [0];
        let pos = 0;
        // TODO windows LF handling?
        while ((pos = dsl.indexOf('\n', pos)) !== -1) {
            linebreaks.push(++pos);
        }
        const streamAppsToIds = {}; // foo.bar=99

        // The result should look like this:
        // {errors:[...], graph:{format:.., streamdefs:[...], nodes:[...], links:[...]}

        const errors = [];

        // streamdefs look like this: {"name":"foo","def":" mail | transform --expression=payload.toString() | log"},
        const streamdefs = [];

        // nodes look like this: {"id":0,"name":"mail","stream-name":"foo","stream-id":1},
        const nodes = [];

        // links look like this: {"from":0,"to":1},
        const links = [];

        let nodeId = 0;
        let streamNumber = 1;
        let lineNumber = 0; // which line of text is being processed
        // streamNumber/lineNumber may not increment at the same rate when there is broken input text
        while (parsedStreams.lines && parsedStreams.lines.length !== 0) {
            // Process a line
            const lineText = dsl.substring(linebreaks[lineNumber], linebreaks[lineNumber + 1]);
            // Example line: {"errors":null,"success":[{"label":"mail","type":"source","name":"mail",
            //                "options":{},"sourceChannelName":null,"sinkChannelName":null},
            //               {"label":"log","type":"sink","name":"log","options":{},"sourceChannelName":null,"sinkChannelName":null}]}
            const line = parsedStreams.lines.shift();
            let streamName = '';
            let streamdef = '';
            // var streamStartNodeId = nodeId;
            let nameSet = false;
            console.log('convertParseResponseToJsonGraph: Line#' + streamNumber + ': ' + JSON.stringify(line));

            // Build the graph/links if there was successfully parsed output
            const parsedNodes = line.nodes;
            if (parsedNodes) {
                let linkFrom = -1;
                for (let n = 0; n < parsedNodes.length; n++) {
                    let linkType = null;
                    // Example node:
                    // {"label":"mail","type":"source","name":"mail","options":{},"sourceChannelName":null,"sinkChannelName":null}
                    const parsedNode = parsedNodes[n];
                    let graphNode = null;
                    let channelText;
                    let newlink;
                    // check for sourceChannelName
                    if (parsedNode.sourceChannelName) {
                        channelText = parsedNode.sourceChannelName;
                        if (channelText.startsWith('tap:')) { // TAP SOURCE
                            const tappedDestination = channelText.substring(4);
                            // Is it a tap on a stream already seen?
                            const alreadyAllocated = streamAppsToIds[tappedDestination];
                            console.log('Processing tap: ' + channelText + ' alreadyAllocated=' + alreadyAllocated);
                            console.log(JSON.stringify(streamAppsToIds));
                            if (typeof alreadyAllocated !== 'undefined') {
                                // No node for this tap, link from the already existing app to the next node
                                linkFrom = alreadyAllocated;
                                linkType = 'tap';
                            } else {
                                // Create new node
                                const tapName = parsedNode.sourceChannelName.substring(4);
                                graphNode = {'id': nodeId++, 'name': 'tap', 'properties': {'name': tapName}};
                                nodes.push(graphNode);
                                linkFrom = graphNode.id;
                            }
                        } else { // DESTINATION SOURCE
                            graphNode = TextToGraphConverter.findExistingDestinationNode(nodes, parsedNode.sourceChannelName);
                            if (!graphNode) {
                                graphNode = {
                                    'id': nodeId++,
                                    'name': 'destination',
                                    'properties': {'name': parsedNode.sourceChannelName}
                                };
                                nodes.push(graphNode);
                            }
                            linkFrom = graphNode.id;
                        }
                        // if (graphNode) {
                        //     if (parsedNode.group) {
                        //         nameSet = true;
                        //         streamName = parsedNode.group;
                        //         if (!streamName.startsWith('UNKNOWN_')) {
                        //             graphNode['stream-name'] = parsedNode.group;
                        //         }
                        //         graphNode['stream-id'] = streamNumber++;
                        //     }
                        // }
                        if (channelText.startsWith('tap:')) {
                            channelText = channelText.substring(3); // TODO tidy up - do it here or sooner?
                        } else {
                            channelText = ':' + channelText;
                        }
                        streamdef = channelText + ' > ';
                    }

                    // Definitions like ":foo > :bar" results in a bridge node with channels set - do not create
                    // a node for the bridge.
                    // Constructs like 'tap:stream:foo >' use a app with undefined name to hang the channel
                    // off (the node isn't real, don't build graph elements for it)
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
                            streamAppsToIds[streamName + '.' + (parsedNode.label ? parsedNode.label : graphNode.name)] = graphNode.id;
                        }
                        if (parsedNode.label) {
                            streamdef = streamdef + parsedNode.label + ': ';
                        }
                        streamdef = streamdef + graphNode.name + ' ';
                        if (!_.isEmpty(parsedNode.options)) {
                            graphNode.properties = parsedNode.options;
                            graphNode.propertiesranges = parsedNode.optionsranges;
                            for (const key in graphNode.properties) {
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
                        graphNode = null;
                        graphNode = TextToGraphConverter.findExistingDestinationNode(nodes, channelText);
                        if (!graphNode) {
                            graphNode = {
                                'id': nodeId++,
                                'name': 'destination',
                                'properties': {'name': channelText}
                            };
                            nodes.push(graphNode);
                        }
                        if (linkFrom !== -1) {
                            newlink = {'from': linkFrom, 'to': graphNode.id};
                            if (linkType) {
                                newlink.linkType = linkType;
                            }
                            links.push(newlink);
                        }
                        if (!nameSet && parsedNode.group) {
                            nameSet = true;
                            streamName = parsedNode.group;
                            if (!streamName.startsWith('UNKNOWN_')) {
                                graphNode['stream-name'] = parsedNode.group;
                            }
                            graphNode['stream-id'] = streamNumber++;
                        }
                        linkFrom = graphNode.id;
                        if (!parsedNode.sourceChannelName || parsedNode.name !== 'bridge') {
                            // if it is a bridge then the source channel already added a '>'
                            streamdef = streamdef + ' > ';
                        }
                        streamdef = streamdef + ':' + channelText;
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
                // VALIDATION: {"message":"Could not find app with name 'bo' and type among [processor, sink]","position":null}
                // SEVERE: {"message":"XD112E:(pos 5): Unexpectedly ran out of input\nbar |\n   * ^\n","position":5}
                // SEVERE: {"message":"XD100E:(pos 14): Found unexpected data after stream definition:
                // 'log'\nmail |  wibbe log |\n             *^\n","position":14}
                // SEVERE: {"message":"XD102E:(pos 20): No whitespace allowed after argument name and
                //                     before =\nrofo | asdfa --name = var\n            *       ^\n","position":20}]
                for (let e = 0; e < line.errors.length; e++) {
                    const error = line.errors[e];

                    let errorToRecord = null;
                    // let range;
                    // let errpos;
                    // if (error.accurate) {
                        // If accurate is set then the message is already correct and needs no processing.
                        // Accurate messages are produced by the local parse.
                        errorToRecord = error;
                    // } else if (error.msg.startsWith('Could not find app with name')) {
                    // 	range = {'start': {'ch': 0, 'line': lineNumber}, 'end': {'ch': 0, 'line': lineNumber}};
                    // 	// "Could not find app with name 'abcd'"
                    // 	var appName = error.msg.substring(error.msg.indexOf('\'') + 1);
                    // 	appName = appName.substring(0, appName.indexOf('\''));
                    // 	errpos = lineText.indexOf(appName);
                    // 	if (lineText.indexOf(appName, errpos + 1) !== -1) {
                    // 		// occurring more than once, let's not be too clever for now, just mark the line
                    // 	} else {
                    // 		// only occurs once, this must be it!
                    // 		range = {
                    // 			'start': {'ch': errpos, 'line': lineNumber},
                    // 			'end': {'ch': errpos + appName.length, 'line': lineNumber}
                    // 		};
                    // 	}
                    // 	// Have a go at finding the app - if it is unique we know we can point at the
                    // 	// right now. If it isn't unique, they probably are all wrong !
                    // 	errorToRecord = {'message': error.msg, 'range': range};
                    // TODO don't need this anymore with all local parsing?
                    // } else if (error.msg.startsWith('XD112E')) {
                    // 	errpos = error.position;
                    // 	range = {
                    // 		'start': {'ch': errpos - 1, 'line': lineNumber},
                    // 		'end': {'ch': errpos, 'line': lineNumber}
                    // 	};
                    // 	errorToRecord = {'message': error.message, 'range': range};
                    // } else if (error.msg.startsWith('XD1')) {
                    // 	errpos = error.position;
                    // 	range = {
                    // 		'start': {'ch': errpos, 'line': lineNumber},
                    // 		'end': {'ch': errpos + 1, 'line': lineNumber}
                    // 	};
                    // 	errorToRecord = {'message': error.msg, 'range': range};
                    // } else {
                    // 	console.log('>>>>>> Did nothing with message: ' + JSON.stringify(error));
                    // }
                    if (errorToRecord) {
                        console.log('updateGraphFn: Recording error ' + JSON.stringify(errorToRecord));
                        errors.push(errorToRecord);
                    }
                }
            }
            lineNumber++;
        }
        const jsonGraph = {'errors': errors, 'graph': null};
        if (nodes.length !== 0) {
            jsonGraph.graph = {'format': 'scdf', 'streamdefs': streamdefs, 'nodes': nodes, 'links': links};
        }
        return jsonGraph;
    }


    private matchGroup(name: string, incoming: number, outgoing: number): string {
        let score = Number.MIN_VALUE;
        let group: string;
        Array.from(this.metamodel.keys()).filter(grp => this.metamodel.get(grp).has(name)).map(
                    grp => this.metamodel.get(grp).get(name)).find(match => {
          let failedConstraintsNumber = 0;
          if (match.group === 'source') {
            if (incoming > 0) {
              failedConstraintsNumber++;
            }
            // if (outgoing > 1) {
            //   failedConstraintsNumber++;
            // }
          } else if (match.group === 'sink') {
            if (incoming > 1) {
              failedConstraintsNumber++;
            }
            if (outgoing > 0) {
              failedConstraintsNumber++;
            }
          } else if (match.group === 'processor') {
            if (incoming > 1) {
              failedConstraintsNumber++;
            }
            // if (outgoing > 1) {
            //   failedConstraintsNumber++;
            // }
          }
          if (failedConstraintsNumber < score) {
            score = failedConstraintsNumber;
            group = match.group;
          }
          return failedConstraintsNumber === 0;
        });
        return group;
    }

    /**
     * Take the JSON description of the flow as provided by the parser and map it into a series
     * of nodes that can be processed by dagre/joint.
     */
    private buildFloGraphFromJsonGraph(jsonGraph: JsonGraph.Graph) {
        const inputnodes = jsonGraph.nodes;
        const inputlinks = jsonGraph.links;

        const incoming = {};
        const outgoing = {};
        let link;
        for (let i = 0; i < inputlinks.length; i++) {
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

        const inputnodesCount = inputnodes ? inputnodes.length : 0;
        const nodesIndex = [];
        for (let n = 0; n < inputnodesCount; n++) {
            const name = inputnodes[n].name;
            const label = inputnodes[n].label;
            let group = inputnodes[n].group;
            if (!group) {
                group = this.matchGroup(name, incoming[n], outgoing[n]);
            }
            const groupMetadata: Map<string, Flo.ElementMetadata> = group ? this.metamodel.get(group) : null;
            let md: Flo.ElementMetadata;
            if (!groupMetadata) {
                // Create fake metadata so some sort of graph can be built
                md = {
                    'group': group,
                    'name': name,
                    get(property: String): Promise<Flo.PropertyMetadata> {
                        return Promise.resolve(null);
                    },
                    properties(): Promise<Map<string, Flo.PropertyMetadata>> {
                        return Promise.resolve(new Map());
                    }
                    };
            } else {
                md = group ? this.metamodel.get(group).get(name) : null;
            }
                  const propertiesMap = new Map<string, any>();
                  if (inputnodes[n].properties) {
              Object.keys(inputnodes[n].properties).forEach(k => propertiesMap.set(k, inputnodes[n].properties[k]));
            }
            const newNode = this.floEditorContext.createNode(md, propertiesMap);
            // Tap and Destination names are in 'props/name' property
            if (name !== 'tap' && name !== 'destination') {
                newNode.attr('node-name', label);
            }
            const streamname = inputnodes[n]['stream-name'];
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

        const inputlinksCount = inputlinks ? inputlinks.length : 0;
        for (let l = 0; l < inputlinksCount; l++) {
            link = inputlinks[l];
            const props: Map<string, string> = new Map();
            props['isTapLink'] = (link.linkType && link.linkType === 'tap') ? 'true' : 'false';
            this.floEditorContext.createLink(
                {'id': nodesIndex[link.from], 'selector': '.output-port', 'port': 'output' },
                {'id': nodesIndex[link.to], 'selector': '.input-port', 'port': 'input'},
                null,
                props);
        }

        this.floEditorContext.performLayout();
        this.floEditorContext.fitToPage();
    }


    public convert() {
        const jsonGraph = TextToGraphConverter.parseToJsonGraph(this.dsl);
        console.log('jsongraph = ' + JSON.stringify(jsonGraph));
        if (jsonGraph && jsonGraph.nodes) {
      this.floEditorContext.clearGraph();
      this.buildFloGraphFromJsonGraph(jsonGraph);
    }
        // this.parseAndRefreshGraph(this.dsl,
        // 	(json) => {
        // 		// flo.getGraph().clear();
        // 		// this.load().then((metamodel) => {
        // 		// 	this.buildGraphFromJson(flo, json, metamodel);
        // 		// })
        // 		console.log("parsed: "+json);
        // 	},
        // 	(errors) => {
        // 		console.log("errors: "+errors);
        // 	});
    }

    // parseAndRefreshGraph(dsl: string, updateGraphFunction, updateErrorsFunction) {
    //     this.parseService.parseDsl(dsl);
    // }
}

export namespace JsonGraph {

    export interface GraphHolder {
        errors;
        graph: Graph;
    }

    export interface Graph {
        errors: {}[];
        format: string;
        streamdefs;
        nodes: Node[];
        links: Link[];
    }

    export interface Node {
        id: number;
        name: string;
        label?: string;
        group?: string;
        'stream-id': number;
        range: Range;
        properties?: Map<string, string>;
        propertiesranges?: Map<string, Range>;
    }

    export interface Pos {
        ch: number;
        line: number;
    }
    export interface Range {
        start: Pos;
        end: Pos;
    }

    export interface Link {
        from: number;
        to: number;
        linkType?: string;
    }
}

export function convertTextToGraph(dsl: string, flo: Flo.EditorContext, metamodel: Map<string, Map<string, Flo.ElementMetadata>>): void {
    console.log('dsl = ' + dsl + '\nmetamodel=' + metamodel);
    new TextToGraphConverter(dsl, flo, metamodel).convert();
}
export function convertParseResponseToJsonGraph(dsl: string, parsedStreams: Parser.ParseResult): JsonGraph.GraphHolder {
  return TextToGraphConverter.convertParseResponseToJsonGraph(dsl, parsedStreams);
}
