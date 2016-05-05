/*
 * Copyright 2016 the original author or authors.
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
define(['angular', 'angularMocks', 'app'], function(angular) {
  'use strict';

  angular.module('xdConf', []).constant('securityInfo', {});

  describe('Unit: Testing metamodel operations', function() {
	beforeEach(function() {angular.mock.module('xdAdmin');});
	//beforeEach(function() {angular.mock.module('xdJobsAdmin');});
	//beforeEach(function() {angular.mock.module('xdStreamsAdmin');});

    it('should contain a ParserService service', inject(function(ParserService, StreamMetamodelServiceXD) {
    	expect(ParserService).toBeDefined();
    	expect(StreamMetamodelServiceXD).toBeDefined();
    }));

    it('basic text to graph', inject(function(ParserService, StreamMetamodelServiceXD) {
    	var text = 'time | log';
    	var parseResponse = ParserService.parse(text);
    	expect(parseResponse.lines).toBeDefined();
    	var line = parseResponse.lines[0];
    	expect(line.errors).toBeNull();
    	expect(StreamMetamodelServiceXD.convertParseResponseToGraph).toBeDefined();    	
    	var graph = StreamMetamodelServiceXD.convertParseResponseToGraph(text,parseResponse);
//    	console.log("graph is "+JSON.stringify(graph));
    	//{"errors":[],
    	// "graph":
    	//  {"format":"xd",
    	//   "streamdefs":[{"name":"","def":"time | log"}],
    	//   "nodes":[
    	//     {"id":0,"label":"time","name":"time","stream-id":1,"range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}}},
    	//     {"id":1,"label":"log","name":"log","range":{"start":{"ch":7,"line":0},"end":{"ch":10,"line":0}}}],
    	//   "links":[{"from":0,"to":1}]}}
    	expect(graph.errors.length).toEqual(0);
    	var nodes = graph.graph.nodes;
    	expect(nodes.length).toEqual(2);
    	var timeNode = nodes[0];
    	expect(timeNode.name).toEqual('time');
    	expect(timeNode.id).toEqual(0);
    	var logNode = nodes[1];
    	expect(logNode.name).toEqual('log');
    	expect(logNode.id).toEqual(1);
    }));
    
    it('destination output', inject(function(ParserService, StreamMetamodelServiceXD) {
    	var text = 'time > :foo';
    	var parseResponse = ParserService.parse(text);
    	expect(parseResponse.lines).toBeDefined();
    	var line = parseResponse.lines[0];
    	expect(line.errors).toBeNull();
    	expect(StreamMetamodelServiceXD.convertParseResponseToGraph).toBeDefined();    	
    	var graph = StreamMetamodelServiceXD.convertParseResponseToGraph(text,parseResponse);
//    	console.log("graph is "+JSON.stringify(graph));
    	// {"errors":[],
    	//  "graph":{
    	//   "format":"xd",
    	//   "streamdefs":[{"name":"","def":"time  > foo"}],
    	//   "nodes":[
    	//    {"id":0,"label":"time","name":"time","stream-id":1,"range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}}},
    	//    {"id":1,"name":"named-channel","properties":{"channel":"foo"}}],
    	//    "links":[{"from":0,"to":1}]}}
    	expect(graph.errors.length).toEqual(0);
    	var nodes = graph.graph.nodes;
    	expect(nodes.length).toEqual(2);
    	var timeNode = nodes[0];
    	expect(timeNode.name).toEqual('time');
    	expect(timeNode.id).toEqual(0);
    	var node2 = nodes[1];
    	expect(node2.name).toEqual('destination');
    	expect(node2.properties.name).toEqual('foo');
    	expect(node2.id).toEqual(1);
    	
    	expect(graph.graph.links.length).toEqual(1);
    	var link = graph.graph.links[0];
    	expect(link.from).toEqual(0);
    	expect(link.to).toEqual(1);
    }));

    it('tap text to graph', inject(function(ParserService, StreamMetamodelServiceXD) {
    	var text = 'FOO = time | log1\n:FOO.time > log2';
    	var parseResponse = ParserService.parse(text);
    	expect(parseResponse.lines).toBeDefined();
    	var line = parseResponse.lines[0];
    	expect(line.errors).toBeNull();
    	expect(StreamMetamodelServiceXD.convertParseResponseToGraph).toBeDefined();
    	var graph = StreamMetamodelServiceXD.convertParseResponseToGraph(text,parseResponse);
//    	console.log('graph is '+JSON.stringify(graph));
    	// {"errors":[],
    	//  "graph":{
    	//   "format":"xd",
    	//   "streamdefs":[
    	//    {"name":"FOO","def":"time | log1"},
    	//    {"name":"","def":"FOO.time > log2"}],
    	//   "nodes":[
    	//    {"id":0,"label":"time","name":"time","stream-name":"FOO","stream-id":1,"range":{"start":{"ch":6,"line":0},"end":{"ch":10,"line":0}}},
    	//    {"id":1,"label":"log1","name":"log1","range":{"start":{"ch":13,"line":0},"end":{"ch":17,"line":0}}},
    	//    {"id":2,"label":"log2","name":"log2","range":{"start":{"ch":12,"line":1},"end":{"ch":16,"line":1}}}],
    	//   "links":[{"from":0,"to":1},{"from":0,"to":2}]}}
    	expect(graph.errors.length).toEqual(0);
    	var nodes = graph.graph.nodes;
    	expect(nodes.length).toEqual(3);
    	// Verify stream 1
    	var node1 = nodes[0];
    	expect(node1.name).toEqual('time');
    	expect(node1['stream-name']).toEqual('FOO');
    	expect(node1.id).toEqual(0);
    	var node2 = nodes[1];
    	expect(node2.name).toEqual('log1');
    	expect(node2.id).toEqual(1);
    	// Verify tap stream
    }));
    
//    it('text to graph and back again - basic', inject(function(ParserService, StreamMetamodelServiceXD) {
//       	var text = 'time | log';
//    	var parseResponse = ParserService.parse(text);
//    	var graph = StreamMetamodelServiceXD.convertParseResponseToGraph(text,parseResponse);
//    	console.log('>>>>'+graph);
//    	var newtext = StreamMetamodelServiceXD.convertGraphToText(graph);
//    	console.log('>>>>'+newtext);
////    	expect(newtext).equals(text);
//    }));
    
//    it('text to graph and back again - tap', inject(function(ParserService, StreamMetamodelServiceXD) {
//    	var text = "FOO = time | log1\n:FOO.time > log2";
//    	var parseResponse = ParserService.parse(text);
//    	expect(parseResponse.lines).toBeDefined();
//    	var line = parseResponse.lines[0];
//    	expect(line.errors).toBeNull();
//    	expect(StreamMetamodelServiceXD.convertParseResponseToGraph).toBeDefined();    	
//    	expect(StreamMetamodelServiceXD.convertGraphToText).toBeDefined();
//
//    	var graph = StreamMetamodelServiceXD.convertParseResponseToGraph(text,parseResponse);
//    	var newtext = StreamMetamodelServiceXD.convertGraphToText(graph);
//    	expect(newtext).equals(text);
//    }));

  });
});
