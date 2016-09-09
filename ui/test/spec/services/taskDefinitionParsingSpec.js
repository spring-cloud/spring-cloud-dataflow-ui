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

/**
 * @author Andy Clement
 */
define(['angular', 'angularMocks', 'app'], function(angular) {
  'use strict';

    describe('Unit: Testing JS Parsing of task definitions', function() {
	  
    beforeEach(function() {
      angular.mock.module('dataflowMain');
    });

    it('should contain a ParserService service', inject(function(ParserService) {
    	expect(ParserService).toBeDefined();
    }));

    it('basic task', inject(function(ParserService) {
    	  var output = ParserService.parse('foo=bar','task');
    	  expect(output.lines).toBeDefined();
    	  expect(output.lines.length).toEqual(1);
    	  var line = output.lines[0];
    	  expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(1);

        var nameNode = line.success[0].group;
        var nameRange = line.success[0].grouprange;
        expect(nameNode).toEqual('foo');
        expect(nameRange.start.ch).toEqual(0);
        expect(nameRange.end.ch).toEqual(3);

        var barNode = line.success[0];
        expect(barNode.name).toEqual('bar');
        expect(barNode.range.start.ch).toEqual(4);
        expect(barNode.range.end.ch).toEqual(7);
    }));

    it('basic task - extra whitespace', inject(function(ParserService) {
    	  var output = ParserService.parse('   foo =     bar  --aa=ttttt','task');
    	  expect(output.lines).toBeDefined();
    	  expect(output.lines.length).toEqual(1);

    	  var line = output.lines[0];
    	  expect(line.errors).toBeNull();
       	expect(line.success).toBeDefined();
        expect(line.success.length).toEqual(1);

        var nameNode = line.success[0].group;
        var nameRange = line.success[0].grouprange;
        expect(nameNode).toEqual('foo');
        expect(nameRange.start.ch).toEqual(3);
        expect(nameRange.end.ch).toEqual(6);

        var barNode = line.success[0];
        expect(barNode.name).toEqual('bar');
        expect(barNode.range.start.ch).toEqual(13);
        expect(barNode.range.end.ch).toEqual(16);

        var barOptions = line.success[0].options;
        var barOptionsranges = line.success[0].optionsranges;
        expect(barOptions.aa).toEqual('ttttt');
        expect(barOptionsranges.aa.start.ch).toEqual(18);
        expect(barOptionsranges.aa.end.ch).toEqual(28);
    }));

    it('missing name', inject(function(ParserService) {
        var output = ParserService.parse('timestamp','task');
        expect(output.lines).toBeDefined();
    	  expect(output.lines.length).toEqual(1);
        var line = output.lines[0];
   	    expect(line.errors).toBeDefined();
        expect(line.errors.length).toEqual(1);
        expect(line.errors[0].message).toEqual('Expected format: name = taskapplication [options]');
    }));

  });
});

