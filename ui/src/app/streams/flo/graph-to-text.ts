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

import { dia } from 'jointjs';
import * as _ from 'lodash';

/**
 * Create the text representation of a graph.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
class GraphToTextConverter {

    static DEBUG : boolean = true;

	static COLON_PREFIX  : string = ':';

	// the graph representation of stream(s)/app(s).
	private g: dia.Graph;

	// Number of Links left to visit
	private numberOfLinksToVisit : number;

	// Number of nodes left to visit
	private numberOfNodesToVisit : number;

	// Links left to visit indexed by id
	private linksToVisit : Map<string, dia.Link>;

	// Nodes left to visit indexed by id
	private nodesToVisit : Map<string, dia.Element>;

	// Count of how many non-visited links a node has (indexed by node id)
	private nodesIncomingLinksCount : Map<string, number>;

	constructor(graph: dia.Graph) {
		this.numberOfLinksToVisit = 0;
		this.numberOfNodesToVisit = 0;
		this.linksToVisit = new Map<string, dia.Link>();
		this.nodesToVisit = new Map<string, dia.Element>();
		this.nodesIncomingLinksCount = new Map<string, number>();
		this.g = graph;
		this.g.getElements().forEach(element => {
			if (this.isNode(element)) {
				var nodeId = element.get('id');
				var incomingLinkCount = 0;
				this.g.getConnectedLinks(element, {inbound: true}).forEach(link => {
					if (this.linkSourceIsNode(link, this.g)) {
						this.linksToVisit[link.get('id')] = link;
						this.numberOfLinksToVisit++;
						incomingLinkCount++;
					}
				});
				this.nodesToVisit[nodeId] = element;
				this.numberOfNodesToVisit++;
				this.nodesIncomingLinksCount[nodeId] = incomingLinkCount;
			}
		});
	}

	// A node is an element with a name
	private isNode(element) : boolean {
		return element.attr('metadata/name');
	}

	private linkSourceIsNode(link, graph) : boolean {
		var linkSource = link.get('source');
		return (linkSource &&
				linkSource.id &&
				graph.getCell(linkSource.id) &&
				this.isNode(graph.getCell(linkSource.id)));
	}

	private isChannel(e) : boolean {
		return e && (e.attr('metadata/name') === 'tap' || e.attr('metadata/name') === 'destination');
	}

	private getName(node) : string {
		if (!node) {return 'UNDEFINED';}
		if (node.incomingtap) {
			return 'TAPPED(' + this.getName(node.incomingtap) + ')';
		}
		var name = node.attr('metadata/name');
		if (name === 'destination') {
			return node.attr('props/name');
		}
		else {
			return name;
		}
	}

    private isTapLink(link) : boolean {
		return link.attr('props/isTapLink') === 'true';
    }

	private printStream(stream) : void {
		var text = 'Stream: ';
		for (var i=0;i<stream.length;i++) {
			if (i>0) {
				text+=' ';
			}
			text+=this.getName(stream[i]);
		}
		console.log(text);
	}

	private getIncomingLinks(node : dia.Cell) : dia.Link[] {
		// Only possible if call is occurring during link drawing (one end connected but not the other)
		if (!node) { return []; }
		return this.g.getConnectedLinks(node, {inbound: true});
	}

	private getNonPrimaryLinks(links : dia.Link[]) : dia.Link[] {
		var nonPrimaryLinks : dia.Link[] = [];
		for (var i = 0; i < links.length; i++) {
			if (this.isTapLink(links[i])) {
				nonPrimaryLinks.push(links[i]);
			}
		}
		return nonPrimaryLinks;
	}

	private getNonPrimaryIncomingLinks(node : dia.Cell) : dia.Link[] {
		return this.getNonPrimaryLinks(this.getIncomingLinks(node));
	}

	private getPrimaryLink(links: dia.Link[]): dia.Link {
		for (var i = 0; i < links.length; i++) {
			if (!this.isTapLink(links[i])) {
				return links[i];
			}
		}
		return null;
	}

	private getPrimaryIncomingLink(node: dia.Cell): dia.Link {
		var incomingLinks = this.getIncomingLinks(node);
		for (var i = 0; i < incomingLinks.length; i++) {
			if (!this.isTapLink(incomingLinks[i])) {
				return incomingLinks[i];
			}
		}
		return null;
	}

	private getOutgoingStreamLinks(node: dia.Cell): dia.Link[] {
		var links: dia.Link[] = [];
		// !node only possible if call is occurring during link drawing (one end connected but not the other)
		if (node) {
			this.g.getConnectedLinks(node, {outbound: true}).forEach((link) => {
				var source = link.get('source');
				if (source.port === 'output') {
					links.push(link);
				}
			});
		}
		return links;
	}

	private findStreamName(node: dia.Cell): string {
		var streamName = node.attr('stream-name');
		if (streamName) {
			return streamName;
		}
		// Go up the link chain to find the named element
		var incomingLinks = this.getIncomingLinks(node);
		if (incomingLinks && incomingLinks.length > 0 && !(incomingLinks.length === 1 && incomingLinks[0].get('source').port === 'tap')) {
			if (incomingLinks.length > 1) {
				throw {'msg': 'nodes should only have 1 incoming link at most. Node '+this.getName(node)+' has '+incomingLinks.length};
			}
			var sourceId = incomingLinks[0].get('source').id;
			var source = this.g.getCell(sourceId);
			return this.findStreamName(source);
		}
		return 'UNKNOWN';
	}

	// Create a destination of the form :streamname.name
	// The 'name' element will be the node name unless a label is provided. If a label is
	// provided it will be used instead.
	private toTapDestination(node: dia.Cell): string {
		var appname = node.attr('node-name');
		if (!appname) {
			appname = node.attr('metadata/name');
		}
		if (appname === 'destination') {
			return GraphToTextConverter.COLON_PREFIX + node.attr('props/name');
		} else {
			return GraphToTextConverter.COLON_PREFIX + this.findStreamName(node) + '.' + appname;
		}
	}

	/**
	 * @return true if any node in this stream is tapped
	 */
	private isTapped(headNode: dia.Cell): boolean {
		if (this.isChannel(headNode)) {
			return false;
		}
		var outgoingLinks = this.getOutgoingStreamLinks(headNode);
		if (outgoingLinks.length > 1) { // multiple outputs, someone is tapping
			return true;
		}
		while (outgoingLinks.length !== 0) {
			var nextId = outgoingLinks[0].get('target').id;
			if (!nextId) { break; } // link is currently being edited
			var nextNode = this.g.getCell(nextId);
			if (this.isTapLink(outgoingLinks[0])) {
				return true;
			}
			if (this.isChannel(nextNode)) {
				break;
			}
			outgoingLinks = this.getOutgoingStreamLinks(nextNode);
			if (outgoingLinks.length > 1) {
				return true;
			}
		}
		return false;
	}

	/**
	 * For any node, for the head of the stream containing it. This will not follow tap links so the
	 * 'heads' of tap streams will also be found (it won't chase the tap link up and
	 * find the head of the tapped stream). It will also stop at regular destinations and
	 * consider the destination a head.
	 */
	private findHead(node: dia.Cell): dia.Cell {
		console.log('findHead for ' + this.getName(node));
		var currentNode = node;
		var incomingTapLinks = this.getNonPrimaryIncomingLinks(node);
		if (incomingTapLinks.length > 0) {
			return node;
		}
		var inLink = this.getPrimaryIncomingLink(currentNode);
		// Only stop at a channel if have followed at least one link
		while (!(this.isChannel(currentNode) && currentNode !== node) && inLink) {
			var sourceId = inLink.get('source').id;
			if (!sourceId) {
				// the link to this node is currently being edited, it has not yet been connected to something
				inLink = null;
			} else {
				// Don't follow back up if the link is not the primary one from that node
				// to this node
				// var possibleCurrentNode = g.getCell(sourceId);
				// var outLinks = getOutgoingStreamLinks(possibleCurrentNode);
				// var indexOfLinkBeingFollowedInOutputLinks = outLinks.indexOf(inLinks[0]);
				// if (indexOfLinkBeingFollowedInOutputLinks !== 0) {
				// 	// This 'currentNode' is the start of a tap
				// 	break;
				// }
				currentNode = this.g.getCell(sourceId);
				inLink = this.getPrimaryIncomingLink(currentNode);
			}
		}
		return currentNode;
	}

	/**
	 * Remove the specified element from the links or nodes to visit as it is about to
	 * be processed.
	 */
	private tidyup(e: dia.Element): dia.Element {
		if (e.isLink()) {
			delete this.linksToVisit[e.get('id')];
			this.nodesIncomingLinksCount[e.get('target').id]--;
			this.numberOfLinksToVisit--;
		} else {
			delete this.nodesToVisit[e.get('id')];
			this.numberOfNodesToVisit--;
		}
		return e;
	}

	/**
	 * Build the string DSL representation of a stream based on the link supplied. The
	 * link is expected to be the first one in the stream.
	 */
	private createTextForNode(element: dia.Element, first?: boolean): string {
		var text = '';
		var props = element.attr('props');
		if (!element) {
			return;
		}

		if (first) {
			if (element.attr('stream-name')) {
				text += element.attr('stream-name') + '=';
			}
		}
		if ('tap' === element.attr('metadata/name') || 'destination' === element.attr('metadata/name')) {
			if (props && props.name) {
				text += GraphToTextConverter.COLON_PREFIX + props.name;
			}
		} else {
			if (element.attr('node-name')) {
				text += element.attr('node-name') + ': ';
			}
			text += element.attr('metadata/name');
			if (props) {
				Object.keys(props).forEach(propertyName => {
					text += ' --' + propertyName + '=' + props[propertyName];
				});
			}
		}
		this.tidyup(element);
		return text;
	}

	// Walk the graph and produce DSL
	public convert(): string {
		if (GraphToTextConverter.DEBUG) { console.log('> graph-to-text'); }
		// 1. Find the obvious stream heads. A stream head is:
		//    - any node without an incoming link
		//    - any node where the incoming link is a tap link
		//    - any node where the incoming link is a non primary link from an app (not destination)
		//    - any destination node that has an incoming and outgoing link(s)
		var i;
		var streamheads=[];
		// var nodesToHead={};
		_.forEach(this.nodesToVisit, (node) => {
			var head = this.findHead(node);
			// if (!_.contains(streamheads,head)) {
			if (!streamheads.find(e => e===head)) {
				streamheads.push(head);
			}
		});
		if (GraphToTextConverter.DEBUG) {
			console.log('Stream Heads discovered from the graph: ');
			for (i=0;i<streamheads.length;i++) {
				console.log(i+') '+this.getName(streamheads[i]));
			}
			console.log('---');
		}
		var streams = [];
		var streamId = 1;
		var stream;
		while (streamheads.length>0) {
			var headNode = streamheads.shift();
			if (GraphToTextConverter.DEBUG) {
				console.log('Visiting '+this.getName(headNode));
			}

			if (this.isTapped(headNode)) {
				// This stream is tapped, it must be named (name generated if necessary)
				var streamName = headNode.attr('stream-name');
				if (!streamName) {
					headNode.attr('stream-name','STREAM_'+streamId);
				}
			}
			var outgoingLinks = this.getOutgoingStreamLinks(headNode);
			var toFollow;
			var target;
			var incomingTapLinks = this.getNonPrimaryIncomingLinks(headNode);
			// If the head is a destination it may have multiple outbound connections, create a stream for each
			if (outgoingLinks.length === 0) {
				if (incomingTapLinks.length === 0) {
					stream = [headNode];
					streamId++;
					streams.push(stream);
				}
				else {
					// Create one variant per incoming tap link
					for (i=0;i<incomingTapLinks.length;i++) {
						stream = [{'incomingtap':this.g.getCell(incomingTapLinks[i].get('source').id)}];
						stream.push(headNode);
						streamId++;
						streams.push(stream);
					}
				}
			} else {
				// var incomingTapLinks = getNonPrimaryIncomingLinks(headNode);
				// if (incomingTapLinks.length !== 0) {
				// 	stream = [headNode];
				// 	streamId++;
				// 	streams.push(stream);
				// }
				var targetId;
				var ol;
				if (incomingTapLinks.length > 0) {
				for (i=0;i<incomingTapLinks.length;i++) {
					// Only need to get clever i
					for (ol = 0; ol < outgoingLinks.length; ol++) {
						stream = [{'incomingtap':this.g.getCell(incomingTapLinks[i].get('source').id)}];
						stream.push(headNode);
						toFollow = this.getPrimaryLink(outgoingLinks);
						// toFollow.push(outgoingLinks[ol]);
						while (toFollow) {
							targetId = toFollow.get('target').id;
							if (!targetId) {
								// This link is not yet connected to something, it is currently being edited
								toFollow = null;
							} else {
								target = this.g.getCell(targetId);
								stream.push(target);
								toFollow = this.getPrimaryLink(this.getOutgoingStreamLinks(target));
								if (this.isChannel(target)) {
									// Reached a channel with following outputs, that marks the end of this stream
									toFollow = null;
								}
							}
						}
						streamId++;
						streams.push(stream);
						if (!this.isChannel(headNode)) {
							// Don't follow more than the primary link, the other links will be taps
							break;
						}
					}
				}
			} else {
				for (ol = 0; ol < outgoingLinks.length; ol++) {
					stream = [headNode];
					toFollow = this.getPrimaryLink(outgoingLinks);
					// toFollow.push(outgoingLinks[ol]);
					while (toFollow) {
						targetId = toFollow.get('target').id;
						if (!targetId) {
							// This link is not yet connected to something, it is currently being edited
							toFollow = null;
						} else {
							target = this.g.getCell(targetId);
							stream.push(target);
							toFollow = this.getPrimaryLink(this.getOutgoingStreamLinks(target));
							if (this.isChannel(target)) {
								// Reached a channel with following outputs, that marks the end of this stream
								toFollow = null;
							}
						}
					}
					streamId++;
					streams.push(stream);
					if (!this.isChannel(headNode)) {
						// Don't follow more than the primary link, the other links will be taps
						break;
					}
				}
			}
				// if (isChannel(headNode) && getIncomingLinks(headNode).length !== 0) {
				// 	// The channel is a stream in its own right
				// 	stream=[headNode];
				// 	streamId++;
				// 	streams.push(stream);
				// }
				// var nonPrimaryLinks = getNonPrimaryLinks(outgoingLinks);
				// for (var tapLink=0; tapLink<nonPrimaryLinks.length;tapLink++) {
				// 	toFollow = nonPrimaryLinks[tapLink];
				// 	stream = [];
				// 	while (toFollow) {
				// 		var targetId = toFollow.get('target').id;
				// 		if (!targetId) {
				// 			// This link is not yet connected to something, it is currently being edited
				// 			toFollow = null;
				// 		} else {
				// 			var target = g.getCell(targetId);
				// 			stream.push(target);
				// 			toFollow = getPrimaryLink(getOutgoingStreamLinks(target));
				// 			if (isChannel(target)) {
				// 				// Reached a channel with following outputs, that marks the end of this stream
				// 				toFollow = null;
				// 			}
				// 		}
				// 	}
				// 	streamId++;
				// 	streams.push(stream);
				// 	if (!isChannel(headNode)) {
				// 		// Don't follow more than the primary link, the other links will be taps
				// 		break;
				// 	}
				// }
			}
		}
		if (GraphToTextConverter.DEBUG) {
			console.log('computed streams');
			_.forEach(streams,(stream) => {
				this.printStream(stream);
			});
			console.log('---');
		}
		// 3. Walk the streams (each is an array of nodes that make up the stream) and produce the DSL text
		var text = '';
		var lineNumber = 0;
		var lineStartIndex = 0;
		for (var s = 0; s < streams.length; s++) {
			if (s > 0) {
				text += '\n';
				lineNumber++;
				lineStartIndex = text.length;
			}
			stream = streams[s];
			for (i = 0; i < stream.length; i++) {
				var node = stream[i];
				if (i === 0) {
					var whereToFindName = i;
					if (node.incomingtap) {
						whereToFindName++;
					}
					if (!this.isChannel(stream[whereToFindName]) && stream[whereToFindName].attr('stream-name')) {
						console.log('Stream has name ' + stream[whereToFindName].attr('stream-name'));
						text += node.attr('stream-name') + '=';
					}
					if (this.isChannel(stream[whereToFindName])) {
						// stream name can be on next node
						if ((whereToFindName+1)<stream.length) {
							var nameOnNextNode = stream[whereToFindName+1].attr('stream-name');
							if (nameOnNextNode) {
								text += nameOnNextNode + '=';
							}
						}
					}
					if (node.incomingtap) {
					// if ((i+1) >= stream.length) {
						// This is what you use for 'tap heads' - it inserts the ':xxx.yyy >' bit on the front
						// var incomingLinks = getNonPrimaryIncomingLinks(node);//getIncomingLinks(node);
						// // TODO deal with multiple incoming ones!
						// if (incomingLinks.length > 0) {
						// 	var sourceId = incomingLinks[0].get('source').id;
						// 	if (sourceId) {
						// 		var source = g.getCell(sourceId);
						// 		text += toTapDestination(source) + ' > ';
						// 	}
						// }
						text+=this.toTapDestination(node.incomingtap) + ' > ';
						continue;
					}
					// }
				}
				var nodeText = this.createTextForNode(node);

				// Set text range for the graph node
				var startCh = text.length - lineStartIndex;
				var endCh = startCh + nodeText.length;
				node.attr('range', {
					start: {ch: startCh, line: lineNumber},
					end: {ch: endCh, line: lineNumber}
				});

				// Append textual representation of the node
				text += nodeText;

				// Are there more nodes?
				if ((i + 1) < stream.length) {
					if (this.isChannel(node) || this.isChannel(stream[i + 1])) {
						text += ' > ';
					} else {
						text += ' | ';
					}
				}
			}
		}
		return text;
	}

}

export function convertGraphToText(g: dia.Graph) : string {
	return new GraphToTextConverter(g).convert();
}
