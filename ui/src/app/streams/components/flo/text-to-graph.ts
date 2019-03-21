/*
 * Copyright 2015-2018 the original author or authors.
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
import { Flo } from 'spring-flo';
import { dia } from 'jointjs';
import * as _ from 'lodash';
import { Parser } from '../../../shared/services/parser';
import { MetamodelService } from './metamodel.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { ApplicationType } from '../../../shared/model';

/**
 * Build a graph representation from text dsl.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
export class TextToGraphConverter {

    static DEBUG = false;

    constructor(private dsl: string, private floEditorContext: Flo.EditorContext,
                private metamodel:  Map<string, Map<string, Flo.ElementMetadata>>) {
    }

    static parseToJsonGraph(dsl: string): JsonGraph.Graph {
        if (!dsl || dsl.trim().length === 0) {
            return {'errors': null, 'format': 'scdf', 'streamdefs': [], 'nodes': [], 'links': []};
        } else {
            const parsedStreams: Parser.ParseResult = Parser.parse(dsl, 'stream');
            return this.convertParseResponseToJsonGraph(dsl, parsedStreams).graph;
        }
    }

    static findExistingDestinationNode(nodes: JsonGraph.Node[], name): JsonGraph.Node {
        for (let n = 0; n < nodes.length; n++) {
            const node = nodes[n];
            if (node.name === 'destination') {
                if (node.properties && node.properties.get('name') === name) {
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
        while ((pos = dsl.indexOf('\n', pos)) !== -1) {
            linebreaks.push(++pos);
        }

        const streamAppsToIds = {}; // foo.bar=99

        // The overall result should look like this:
        // {errors:[...], graph:{format:.., streamdefs:[...], nodes:[...], links:[...]}

        const errors = [];

        // streamdefs look like this:
        // {"name":"foo","def":" mail | transform --expression=payload.toString() | log"},
        const streamdefs = [];

        // nodes look like this:
        // {"id":0,"name":"mail","stream-name":"foo","stream-id":1},
        const nodes: JsonGraph.Node[] = [];

        // links look like this:
        // {"from":0,"to":1},
        const links: JsonGraph.Link[] = [];

        let nodeId = 0;
        let streamNumber = 1;
        let lineNumber = 0; // which line of text is being processed
        // streamNumber/lineNumber may not increment at the same rate when there is broken input text
        while (parsedStreams.lines && parsedStreams.lines.length !== 0) {
            // Process a line
            const lineText = dsl.substring(linebreaks[lineNumber], linebreaks[lineNumber + 1]);
            // Example line:
            // {"errors":null,
            //  "success":[{"label":"mail","type":"source","name":"mail",
            //              "options":{},"sourceChannelName":null,"sinkChannelName":null},
            //             {"label":"log","type":"sink","name":"log",
            //              "options":{},"sourceChannelName":null,"sinkChannelName":null}]}
            const line = parsedStreams.lines.shift();
            let streamName = '';
            let streamdef = '';
            // var streamStartNodeId = nodeId;
            let nameSet = false;
            if (TextToGraphConverter.DEBUG) {
              LoggerService.log('convertParseResponseToJsonGraph: Line#' + streamNumber + ': ' + JSON.stringify(line));
            }

            // Build the graph/links if there was successfully parsed output
            const parsedNodes = <Parser.StreamApp[]>line.nodes;
            if (parsedNodes) {
                let linkFrom = -1;
                for (let n = 0; n < parsedNodes.length; n++) {
                    let linkType = null;
                    let linkCount = 0; // Only first link should be a tap link
                    // Example node:
                    // {"label":"mail","type":"source","name":"mail","options":{},
                    //  "sourceChannelName":null,"sinkChannelName":null}
                    const parsedNode = parsedNodes[n];
                    let graphNode: JsonGraph.Node = null;
                    let channelText;
                    let newlink;
                    // check for sourceChannelName
                    if (parsedNode.sourceChannelName) {
                        channelText = parsedNode.sourceChannelName;
                        if (channelText.startsWith('tap:')) { // TAP SOURCE
                            const tappedDestination = channelText.substring(4);
                            const alreadyAllocated = streamAppsToIds[tappedDestination];
                            if (typeof alreadyAllocated !== 'undefined') {
                                // No node for this tap, link from the already existing app to the next node
                                linkFrom = alreadyAllocated;
                                linkType = 'tap';
                            } else {
                                // Create new node
                                const tapName = parsedNode.sourceChannelName.substring(4);
                                graphNode = {
                                    'id': nodeId++,
                                    'name': 'tap',
                                    'properties': new Map([['name', tapName]])
                                };
                                nodes.push(graphNode);
                                linkFrom = graphNode.id;
                            }
                        } else { // DESTINATION SOURCE
                            graphNode = TextToGraphConverter.findExistingDestinationNode(nodes, parsedNode.sourceChannelName);
                            if (!graphNode) {
                                graphNode = {
                                    'id': nodeId++,
                                    'name': 'destination',
                                    'properties': new Map([['name', parsedNode.sourceChannelName]])
                                };
                                nodes.push(graphNode);
                            }
                            linkFrom = graphNode.id;
                        }
                        if (channelText.startsWith('tap:')) {
                            channelText = channelText.substring(3); // TODO tidy up - do it here or sooner?
                        } else {
                            channelText = ':' + channelText;
                        }
                        streamdef = channelText + ' > ';
                    }

                    // Definitions like ":foo > :bar" results in a bridge node with channels set - do not create
                    // a node for the bridge.
                    if (!(parsedNode.sourceChannelName &&
                          parsedNode.sinkChannelName &&
                          parsedNode.name === 'bridge') &&
                        parsedNode.name) {
                        if (n > 0) {
                            if (parsedNode.type !== 'app') {
                                streamdef = streamdef + '| ';
                            } else {
                                streamdef = streamdef + ' || ';
                            }
                        }
                        graphNode = {
                            'id': nodeId++,
                            'label': parsedNode.label,
                            'name': parsedNode.name,
                            'group': parsedNode.type,
                            'range': parsedNode.range
                            };
                        if (parsedNode.type !== 'app') {
                            if (linkFrom !== -1) {
                                newlink = {'from': linkFrom, 'to': graphNode.id};
                                if (linkCount === 0 && linkType) {
                                    newlink.linkType = linkType;
                                }
                                links.push(newlink);
                                linkCount++;
                            }
                            linkFrom = graphNode.id;
                        }
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
                        streamdef = streamdef + graphNode.name + ((parsedNode.type !== 'app') ? ' ' : '' );
                        if (parsedNode.options.size !== 0) {
                            graphNode.properties = parsedNode.options;
                            graphNode.propertiesranges = parsedNode.optionsranges;
                            for (const key of Array.from(graphNode.properties.keys())) {
                                streamdef = streamdef + '--' + key + '=' + graphNode.properties.get(key) + ' ';
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
                                'properties': new Map([['name', channelText]])
                            };
                            nodes.push(graphNode);
                        }
                        if (linkFrom !== -1) {
                            newlink = {'from': linkFrom, 'to': graphNode.id};
                            if (linkCount === 0 && linkType) {
                                newlink.linkType = linkType;
                            }
                            links.push(newlink);
                            linkCount++;
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
                            streamdef = streamdef + '> ';
                        }
                        streamdef = streamdef + ':' + channelText;
                    }

                }

                if (streamName.startsWith('UNKNOWN_')) {
                    streamName = '';
                }
                streamdefs.push({'name': streamName, 'def': streamdef.trim()});
                // Create links
//    				for (var l=streamStartNodeId;l<(nodeId-1);l++) {
//    					links.push({'from':l,'to':(l+1)});
//    				}
            }

            if (line.errors) {
                for (let e = 0; e < line.errors.length; e++) {
                    const error = line.errors[e];
                    if (TextToGraphConverter.DEBUG) {
                      LoggerService.log('updateGraphFn: Recording error ' + JSON.stringify(error));
                    }
                    errors.push(error);
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
        const match1 = Array.from(this.metamodel.keys()).filter(grp => this.metamodel.get(grp).has(name)).map(
                    grp => this.metamodel.get(grp).get(name)).map(match => {
          let score = 0;
          switch (match.group) {
            case ApplicationType[ApplicationType.app]:
              if (incoming > 1) {
                score -= 10;
              }
              if (outgoing > 1) {
                score -= 10;
              }
              if (incoming === 0 && outgoing === 0) {
                score += 5;
              }
              break;
            case ApplicationType[ApplicationType.source]:
              if (incoming > 0) {
                score -= 10;
              } else if (outgoing === 1) {
                score += 5;
              } else {
                score += 3;
              }
              break;
            case ApplicationType[ApplicationType.processor]:
              if (incoming === 1) {
                score += 3;
              } else if (incoming > 1) {
                score += 1;
              }
              if (outgoing === 1) {
                score += 3;
              } else if (outgoing > 1) {
                score += 1;
              }
              break;
            case ApplicationType[ApplicationType.sink]:
              if (outgoing > 0) {
                score -= 10;
              } else if (incoming === 1) {
                score += 5;
              } else {
                score += 3;
              }
              break;
            default:
              score = Number.MIN_VALUE;
          }
          return {
            match,
            score
          };
        }).reduce((bestMatch, currentMatch) => {
          if (bestMatch) {
            if (currentMatch.score > bestMatch.score) {
              return currentMatch;
            }
          }
          return bestMatch;
        });
        return match1 ? match1.match.group : ApplicationType[ApplicationType.app];
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
            let group = null; // Ignore inputnodes[n].group; - instead compute the right result in matchGroup
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
                      },
                      metadata: {
                        unresolved: true
                      }
                    };
            } else {
                md = group ? this.metamodel.get(group).get(name) : null;
            }
            const propertiesMap = new Map(inputnodes[n].properties);
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
            const props: Map<string, any> = new Map();
            props.set('isTapLink', (link.linkType && link.linkType === 'tap') ? true : false);
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
        if (jsonGraph && jsonGraph.nodes) {
            this.floEditorContext.getGraph().clear();
            this.buildFloGraphFromJsonGraph(jsonGraph);
        }
    }
}

export namespace JsonGraph {

    export interface GraphHolder {
        errors;
        graph: Graph;
    }

    export interface Graph {
        errors: Parser.Error[];
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
        'stream-id'?: number;
        range?: Range; // optional for channels
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
    new TextToGraphConverter(dsl, flo, metamodel).convert();
}

export function convertParseResponseToJsonGraph(dsl: string, parsedStreams: Parser.ParseResult): JsonGraph.GraphHolder {
  return TextToGraphConverter.convertParseResponseToJsonGraph(dsl, parsedStreams);
}

interface MatchAndScore<T> {
  match: T;
  score: number;
}
