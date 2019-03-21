/*
 * Copyright 2016 the original author or authors.
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
 * @author Andy Clement
 * @author Alex Boyko
 * @author Gunnar Hillert
 */
define(['angular', 'angularMocks', 'app'], function(angular) {
  'use strict';

  describe('Unit: Testing JS Parsing of DSL', function() {
	beforeEach(function() {
          angular.mock.module('dataflowMain');
        });

    it('should contain a StreamParserService service', inject(function(StreamParserService) {
    	expect(StreamParserService).toBeDefined();
    }));

    it('basic stream', inject(function(StreamParserService) {
    	var output = StreamParserService.parse('time | log');
    	// {"lines":[
    	//   {"errors":null,
    	//    "success":[
    	//      {"group":"UNKNOWN_0","type":"source","name":"time","range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}},"options":{},"optionsranges":{},"sourceChannelName":null,"sinkChannelName":null},
    	//      {"group":"UNKNOWN_0","type":"sink","name":"log","range":{"start":{"ch":7,"line":0},"end":{"ch":10,"line":0}},"options":{},"optionsranges":{},"sourceChannelName":null,"sinkChannelName":null}]}]}
		// console.log('parse response: '+JSON.stringify(output));
    	expect(output.lines).toBeDefined();
    	expect(output.lines.length).toEqual(1);
    	var line = output.lines[0];
    	expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(2);
        var timeNode = line.success[0];
        expect(timeNode.name).toEqual('time');
        expect(timeNode.range.start.ch).toEqual(0);
        expect(timeNode.range.end.ch).toEqual(4);
        var logNode = line.success[1];
        expect(logNode.name).toEqual('log');
        expect(logNode.range.start.ch).toEqual(7);
        expect(logNode.range.end.ch).toEqual(10);
    }));

    it('sink destination parsing', inject(function(StreamParserService) {
    	var output = StreamParserService.parse('time > :destination');
    	// {"lines":[
    	//  {"errors":null,
    	//   "success":[
    	//    {"group":"UNKNOWN_0","type":"sink","name":"time","range":{"start":{"ch":0,"line":0},"end":{"ch":4,"line":0}},"options":{},"optionsranges":{},"sourceChannelName":null,"sinkChannelName":"destination"}]}]}'
		// console.log('parse response: '+JSON.stringify(output));
    	expect(output.lines).toBeDefined();
    	expect(output.lines.length).toEqual(1);
    	var line = output.lines[0];
    	expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(1);
        var timeNode = line.success[0];
        expect(timeNode.name).toEqual('time');
        expect(timeNode.range.start.ch).toEqual(0);
        expect(timeNode.range.end.ch).toEqual(4);
        expect(timeNode.sinkChannelName).toEqual('destination');
    }));

    it('source destination parsing', inject(function(StreamParserService) {
    	// {"lines":[{"errors":null,"success":[{"group":"UNKNOWN_0","type":"processor","name":"log","range":{"start":{"ch":15,"line":0},"end":{"ch":18,"line":0}},"options":{},"optionsranges":{},"sourceChannelName":"destination","sinkChannelName":null}]}]}
    	var output = StreamParserService.parse(':destination > log');
		// console.log('parse response'+JSON.stringify(output));
    	expect(output.lines).toBeDefined();
    	expect(output.lines.length).toEqual(1);
    	var line = output.lines[0];
    	expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(1);
        var logNode = line.success[0];
        expect(logNode.name).toEqual('log');
        expect(logNode.range.start.ch).toEqual(15);
        expect(logNode.range.end.ch).toEqual(18);
        expect(logNode.sourceChannelName).toEqual('destination');
    }));

    it('tap destination parsing', inject(function(StreamParserService) {
    	var output = StreamParserService.parse(':someStream.foo > log');
    	// console.log('parse response'+JSON.stringify(output));
    	expect(output.lines).toBeDefined();
    	expect(output.lines.length).toEqual(1);
    	var line = output.lines[0];
    	expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(1);
        var logNode = line.success[0];
        expect(logNode.name).toEqual('log');
        expect(logNode.range.start.ch).toEqual(18);
        expect(logNode.range.end.ch).toEqual(21);
        expect(logNode.sourceChannelName).toEqual('tap:someStream.foo');
    }));

  });
});

