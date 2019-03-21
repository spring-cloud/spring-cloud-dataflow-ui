/*
 * Copyright 2015-2017 the original author or authors.
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

import { dia } from 'jointjs';
import * as _ from 'lodash';
import { JsonGraph } from './text-to-graph';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Create the text representation of a graph.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class GraphToTextConverter {

    static DEBUG = true;

    static DESTINATION_DSL_PREFIX = ':';

    private g: dia.Graph;

    private nodes: dia.Element[];

    private nodeCount: number;

    constructor(graph: dia.Graph) {
        this.g = graph;
        this.nodes = [];
        this.g.getElements().forEach(element => {
            if (this.isNode(element)) {
                this.nodes.push(element);
            }
        });
        this.nodeCount = this.nodes.length;
    }

    /**
     * General overview of algorithm:
     *
     * Walk all the nodes in the graph. Based on the type of the node (channel vs app)
     * and the number of incoming/outgoing links (and their type) it is possible to
     * tell whether that node is the head of one or more streams.
     */

    public walkGraph(): string {
        const streams: dia.Cell[][] = [];
        const appStream: dia.Cell[] = [];
        const tapStreams: number[] = [];
        let stream: dia.Cell[];
        for (let n = 0; n < this.nodeCount; n++) {
            const node = this.nodes[n];
            const linksIn = this.getLinksIn(node);
            const linksOut = this.getLinksOut(node);
            if (GraphToTextConverter.DEBUG) {
              LoggerService.log('Walking node ' + this.getName(node) + ' in=#' + linksIn.length + ' out=#' + linksOut.length);
            }
            // What to do depends on the combination of in/out links
            if (linksIn.length === 0) {
                if (linksOut.length === 0) {
                    if (node.attr('metadata/group') === 'app') {
                        appStream.push(node);
                    } else {
                        // Isolated node, let's put it in the DSL so it is not lost, the graph is a work in progress.
                        streams.push([node]);
                    }
                } else {
                    if (this.areAllTapLinks(linksOut)) {
                        // Special case, a bit like above it is an isolated node (the stream is actually
                        // in error because a source must have an input) but for now create a solo node just
                        // to produce slightly better (although invalid) DSL.
                        streams.push([node]);
                    }
                    // Only outgoing links. This is the head of a stream.
                    for (let l = 0; l < linksOut.length; l++) {
                        const link = linksOut[l];
                        const streamId = streams.length + 1;
                        stream = this.produceStream(node, streamId, link);
                        if (this.isTapLink(link)) {
                            if (this.isChannel(node)) {
                                throw {'msg': 'no tap links from channels'};
                            }
                            tapStreams.push(streamId - 1);
                        }
                        streams.push(stream);
                    }
                }
            } else {
                // There are links in so this doesn't look like a stream head, unless it
                // is a normal app with tap links out or a channel with links out
                if (this.isChannel(node)) {
                    if (linksOut.length !== 0) {
                        for (let l = 0; l < linksOut.length; l++) {
                            const link = linksOut[l];
                            const streamId = streams.length + 1;
                            stream = this.produceStream(node, streamId, link);
                            streams.push(stream);
                            if (this.isTapLink(link)) {
                                throw {'msg': 'no tap links from channels'};
                            }
                        }
                    }
                } else {
                    // Are there any tap links from this normal node?
                    for (let l = 0; l < linksOut.length; l++) {
                        if (this.isTapLink(linksOut[l])) {
                            const link = linksOut[l];
                            const streamId = streams.length + 1;
                            stream = this.produceStream(node, streamId, link);
                            tapStreams.push(streamId - 1);
                            streams.push(stream);
                        }
                    }
                }
            }
        }
        if (appStream.length !== 0) {
            // Adjust app stream. Place the node with `stream-name` at the front
            let index = -1;
            const streamHead = appStream.find((e: dia.Element, i: number) => {
              if (e.attr('stream-name')) {
                index = i;
                return true;
              }
            });
            if (index >= 0) {
              // Move elements to the next array cell to move streamHead at the start
              for (let i = index; i > 0; i--) {
                appStream[i] = appStream[i - 1];
              }
              appStream[0] = streamHead;
            }
            streams.push(appStream);
        }

        this.ensureStreamHeadsNamedWhereNecessary(streams, tapStreams);

        const dsl = this.produceDslText(streams, tapStreams);
        return dsl;
    }

    /**
     * Discover which stream has that node in it.
     */
    private findStreamWithNode(streams: dia.Cell[][], tapStreams: number[], node: dia.Cell): number {
        for (let s = 0; s < streams.length; s++) {
            const stream = streams[s];
            for (let n = (tapStreams.indexOf(s) === -1 ? 0 : 1); n < stream.length; n++) {
                if (stream[n] === node) {
                    return s;
                }
            }
        }
    }

    private ensureStreamHeadsNamedWhereNecessary(streams: dia.Cell[][], tapStreams: number[]) {
        if (GraphToTextConverter.DEBUG) {
          LoggerService.log('Ensuring streams have names where necessary');
        }
        for (let t = 0; t < tapStreams.length; t++) {
            if (GraphToTextConverter.DEBUG) {
              LoggerService.log('  checking tapstream ' + t + ' => ' + tapStreams[t]);
            }
            const tapStream = streams[tapStreams[t]];
            // the first element of the tapStream is in another stream, need to make
            // sure that stream has a name.
            const tapHead = tapStream[0];
            const nameTarget = this.findElementThatWouldHoldStreamName(tapHead);
            if (!nameTarget.attr('stream-name')) {
                if (GraphToTextConverter.DEBUG) {
                  LoggerService.log('  missing name ');
                }
                const streamId = this.findStreamWithNode(streams, tapStreams, nameTarget) + 1;
                if (GraphToTextConverter.DEBUG) {
                  LoggerService.log('  setting stream name on ' + this.getName(nameTarget) + ' to STREAM_' + streamId);
                }
                nameTarget.attr('stream-name', 'STREAM_' + streamId);
            }
        }
    }

    private produceDslText(streams: dia.Cell[][], tapStreams: number[]): string {
        let text = '';
        let lineStartIndex = 0;
        if (GraphToTextConverter.DEBUG) {
          LoggerService.log('Producing DSL text ...');
        }
        for (let s = 0; s < streams.length; s++) {
            if (GraphToTextConverter.DEBUG) {
              LoggerService.log('  for stream ' + (s + 1));
            }
            if (s > 0) {
                text += '\n';
                lineStartIndex = text.length;
            }
            const stream = streams[s];

            for (let i = 0; i < stream.length; i++) {
                const node = stream[i];
                const isTapStream = typeof tapStreams.find(ts => ts === s) !== 'undefined';
                if (i === 0) { // If first node, special handling...
                    // For a tap the name is on the 2nd element
                    const nameIndex = (isTapStream || this.isChannel(node)) ? 1 : 0;
                    if (nameIndex < stream.length) {
                        const possibleStreamName = stream[nameIndex].attr('stream-name');
                        if (GraphToTextConverter.DEBUG) {
                          LoggerService.log('  looking for name on element at index ' + nameIndex + '(' +
                                        this.getName(stream[nameIndex]) + ') => ' + possibleStreamName);
                        }
                        if (possibleStreamName) {
                            text += possibleStreamName + '=';
                        }
                    }
                    if (isTapStream) {
                        text += this.toTapString(node) + ' > ';
                        continue;
                    }
                }

                const startCh = text.length - lineStartIndex;
                const nodeText = this.createTextForNode(node, startCh, s);

                // Append textual representation of the node
                text += nodeText;

                // Are there more nodes?
                if ((i + 1) < stream.length) {
                    if (this.isChannel(node) || this.isChannel(stream[i + 1])) {
                        text += ' > ';
                    } else {
                        if (node.attr('metadata/group') === 'app') {
                            text += ' || ';
                        } else {
                            text += ' | ';
                        }
                    }
                } else if (node.attr('metadata/name') === 'tap') {
                    text += ' >'; // the graph isn't well formed but convenient to put this on end of DSL
                }
            }
        }
        return text;
    }

    private produceStream(head: dia.Cell, streamNumber: number, firstLink: dia.Link): dia.Cell[] {
        const stream: dia.Cell[] = [head];
        if (GraphToTextConverter.DEBUG) {
          LoggerService.log('  producing stream number ' + streamNumber + ' starting from ' + this.getName(head));
        }
        let toFollow: dia.Link = firstLink;
        while (toFollow) {
            const nextNodeId: string = toFollow.get('target').id;
            if (!nextNodeId) { break; } // link is probably currently being edited
            const nextNode = this.g.getCell(nextNodeId);
            if (!nextNode) { break; }
            // The next node will be:
            // - a normal app (source/processor/sink)
            // - a channel
            // A channel is the end of the stream. A node may be if it has no further connections
            stream.push(nextNode);
            if (this.isChannel(nextNode)) {
                break;
            }
            // more than one primary output link for a normal app (non channel) is a BUG in the graph
            toFollow = this.findPrimaryLink(this.getLinksOut(nextNode));
        }
        if (GraphToTextConverter.DEBUG) {
          LoggerService.log('  produced sequence: ' + this.toStringNodes(stream));
        }
        return stream;
    }

    private toStringNodes(nodes: dia.Cell[]): string {
        let s = '';
        for (let n = 0; n < nodes.length; n++) {
            if (n > 0) {
                s += ' ';
            }
            s += this.getName(nodes[n]);
        }
        return s;
    }

    private getLinksIn(node: dia.Cell): dia.Link[] {
        return node ? this.g.getConnectedLinks(node, {inbound: true}) : [];
    }

    private getLinksOut(node: dia.Cell): dia.Link[] {
        return node ? this.g.getConnectedLinks(node, {outbound: true}) : [];
    }

    private isNode(element: dia.Element): boolean {
        return element.attr('metadata/name');
    }

    private isChannel(e: dia.Cell): boolean {
        return e && (e.attr('metadata/name') === 'tap' || e.attr('metadata/name') === 'destination');
    }

    private findPrimaryLink(links: dia.Link[]): dia.Link {
        for (let i = 0; i < links.length; i++) {
            if (!this.isTapLink(links[i])) {
                return links[i];
            }
        }
        return null;
    }

    private isTapLink(link): boolean {
        return link.attr('props/isTapLink') === true;
    }

    private areAllTapLinks(links: dia.Link[]): boolean {
        for (let i = 0; i < links.length; i++) {
            if (!this.isTapLink(links[i])) {
                return false;
            }
        }
        return true;
    }

    private getName(node: dia.Cell): string {
        const name: string = node.attr('metadata/name');
        if (name === 'destination') {
            return ':' + node.attr('props/name');
        } else {
            return name;
        }
    }

    // Create a destination of the form ':streamname.name'. The 'name' element will be
    // the node name unless a label is provided. If a label is provided it will be used instead.
    private toTapString(node: dia.Cell): string {
        let appname: string = node.attr('node-name');
        if (!appname) {
            appname = node.attr('metadata/name');
        }
        // Note: not allowed to tap a destination
        return GraphToTextConverter.DESTINATION_DSL_PREFIX + this.findStreamName(node) + '.' + appname;
    }

    /**
     * For some node, find the element that would hold the name of the stream.
     * This will be the first node in a stream unless that node is a channel in
     * which case it will be the second node.  What makes this complicated is
     * the graph has links between streams in it (supporting fan-in/fan-out) so
     * it needs to walk to the beginning but not into another stream.
     */
    private findElementThatWouldHoldStreamName(node: dia.Cell): dia.Cell {
        do {
            const linksIn = this.getLinksIn(node);
            if (linksIn.length > 0) {
                // Walk that link if it doesn't take us to a channel
                const source = this.g.getCell(linksIn[0].get('source').id);
                if (this.isChannel(source)) {
                    break;
                } else {
                    node = source;
                }
            } else {
                break;
            }
        } while (true);
        return node;
    }

    private findStreamName(node: dia.Cell): string {
        const nameNode = this.findElementThatWouldHoldStreamName(node);
        return nameNode.attr('stream-name');
    }

    private createTextForNode(node: dia.Cell, startCh: number, lineNo: number): string {
        let text = '';
        const props = node.attr('props');
        // Tap nodes less likely when fan-in/fan-out supported but may still occur
        if ('tap' === node.attr('metadata/name') || 'destination' === node.attr('metadata/name')) {
            if (props && props.name) {
                text += GraphToTextConverter.DESTINATION_DSL_PREFIX + props.name;
            } else {
                // destination node has been created but not yet given a name
                text += GraphToTextConverter.DESTINATION_DSL_PREFIX + 'undefined';
            }
        } else {
            const label = this.getLabel(node);
            if (label) { // label
                text += label + ': ';
            }
            text += node.attr('metadata/name');
            if (props) {
                const propertiesRanges: Map<string, JsonGraph.Range> = new Map();
                let propertyStart = startCh + text.length;
                Object.keys(props).forEach(propertyName => {
                    const propertyText = ' --' + propertyName + '=' + props[propertyName];
                    text += propertyText;
                    propertiesRanges.set(propertyName,
                        { start: {ch: propertyStart + 1, line: lineNo},
                            end: {ch: propertyStart + propertyText.length, line: lineNo}});
                    propertyStart += propertyText.length;
                });
                node.attr('propertiesranges', propertiesRanges);
            }
        }
        const endCh = startCh + text.length;
        node.attr('range', {
            start: {ch: startCh, line: lineNo},
            end: {ch: endCh, line: lineNo}
        });
        return text;
    }

    private getLabel(node: dia.Cell) {
        return node.attr('node-name');
    }

}

export function convertGraphToText(g: dia.Graph): string {
    return new GraphToTextConverter(g).walkGraph();
}
