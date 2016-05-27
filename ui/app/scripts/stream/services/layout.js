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

/**
 * Implement layout function for streams.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define(function (require) {
	'use strict';
	
    var DEBUG = false;

    var OUTPUT_PORT = 'output';
    var TAP_PORT = 'tap';
    
    var joint = require('joint');
    
    /**
	 * Graph representation of stream(s)/app(s).
	 * @type {joint.dia.Graph}
	 */
    var graph;
    
    function getIncomingLinks(node) {
        return graph.getConnectedLinks(node,{inbound: true});
    }
    
    function getOutgoingLinks(node,portKind) {
        var allLinks = graph.getConnectedLinks(node,{outbound: true});
        var retval = [];
        for (var i=0;i<allLinks.length;i++) {
        var link = allLinks[i];
            if (link.get('source').port === portKind) {
                retval.push(link);
            }
        }
        return retval;
    }
    
    function isTapLink(link) {
        return link.get('source').port === TAP_PORT;
    }
    
    /**
     * Position a single node then recursively invoke positionNode for downstream nodes and connected taps.
     */
    function positionNode(node,col,row) {
        // Could cache this info - all nodes are the same size (I assert...)
        var bbox = node.getBBox();
        // Sizes used here relate to node sizes in render-service and the default grid size (40)
        var offsetx = 40;//bbox.width/2;
        var offsety = 40;//bbox.height/2;
        var hspace = 120+80;//bbox.width*1.5; 
        var vspace = 40*2;//bbox.height*2; 
        node.translate((offsetx+col*hspace)-bbox.x,(offsety+row*vspace)-bbox.y);
        var outgoingLinks = getOutgoingLinks(node,OUTPUT_PORT);
        var target, targetId;
        if (outgoingLinks.length !== 0) {
            targetId = outgoingLinks[0].get('target').id;
            target = graph.getCell(targetId);
            row = positionNode(target,col+1,row);
        }
        // As we 'unwind' visit tap streams
        var outgoingTapLinks = getOutgoingLinks(node,TAP_PORT);
        for (var i=0;i<outgoingTapLinks.length;i++) {
            row++;
            var link = outgoingTapLinks[i];
            targetId = link.get('target').id;
            target = graph.getCell(targetId);
            row = positionNode(target,col+1,row);
        }
        return row;
    }
    
    // Simple layout algorithm for streams
    // 1) what is the length of the longest stream?
    //    - need to take into account a 3 element tapping stream that taps off the 2nd element of a 4 element stream
    // 2) That gives us the number of columns required
    // 3) Rows is simply the number of streams
    // 4) In that grid just position the stream elements - the main streams will appears as lines with the taps
    //    below them. Important to position taps nearer the end first so lines don't overlap
        
    return function(paper) {
        graph = paper.model;
        if (DEBUG) { console.log('>layout');}
        var graphElements = graph.getElements(); // nodes and links
        var headInfos = []; // A stream head is a node without a link into it or first nodes after a tap connection
        var i, incomingLinks, headInfo;

        for (i=0; i<graphElements.length; i++) {
            var graphElement = graphElements[i];
            if (graphElement.get('type') === joint.shapes.flo.NODE_TYPE) {
                // Is this a HEAD?
                incomingLinks = getIncomingLinks(graphElement);
                if (incomingLinks.length === 0) {
                    headInfos.push({'head':graphElement,'isTap':false});
                } else if (incomingLinks.length ===1 && isTapLink(incomingLinks[0])) {
                    headInfos.push({'head':graphElement,'isTap':true});
                }
            }
        }
        if (DEBUG) { console.log('layout: Heads are '+JSON.stringify(headInfos));}

        // Compute length of headInfo entries
        var maxLength = -1;
        for (i=0;i<headInfos.length;i++) {
            headInfo = headInfos[i];
            var length = 1;
            var link;
            // Compute size of 'tail'
            var outgoingLinks = getOutgoingLinks(headInfo.head,OUTPUT_PORT);
            while (outgoingLinks.length!==0) {
                length++;
                link = outgoingLinks[0];
                var targetId = link.get('target').id;
                var target = graph.getCell(targetId);
                outgoingLinks = getOutgoingLinks(target,OUTPUT_PORT);
            }
            // If this is the head of a tap then need to compute the upstream length too
            incomingLinks = getIncomingLinks(headInfo.head);
            while (incomingLinks.length!==0) {
                length++;
                link = incomingLinks[0];
                var sourceId = link.get('source').id;
                var source = graph.getCell(sourceId);
                incomingLinks = getIncomingLinks(source);
            }
            headInfo.length = length;
            if (length > maxLength) {
                maxLength = length;
            }
        }
        if (DEBUG) { console.log('layout: Lengths are '+JSON.stringify(headInfos));}

        // Grid size = #maxlength columns and #headInfos.length rows
        
        // Iterate over headInfo objects and position them
        var row = 0;
        for (i=0;i<headInfos.length;i++) {
            headInfo = headInfos[i];
            if (headInfo.isTap) { continue; }// taps will be looked after whilst visiting other nodes
            row = positionNode(headInfo.head,0,row);
            row++;
        }
    };
});
