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

    describe('Unit: Testing JS validation of task definitions', function() {
	  
    beforeEach(function() {
      angular.mock.module('dataflowMain');
    });

    it('should have a TaskDslValidatorService', inject(function(TaskDslValidatorService) {
    	expect(TaskDslValidatorService).toBeDefined();
    }));

    // it('validation of basic task', inject(function(TaskDslValidatorService) {
    //     var validator = TaskDslValidatorService.createValidator('foo=bar');
    //     // I fear there is too much horrible magic required to do this nicely *sigh*
    //     // Without messing about in beforeEach I'm not sure you can make the test
    //     // properly wait for the promise to resolve and the results to be checked

    //     validator.validate().then(function(validationResults) {
    //       console.log('validationResults = '+JSON.stringify(validationResults));
    //     });
    //     expect(1).toEqual(2);
        
    // 	  // var output = ParserService.parse('foo=timestamp','task');
    // 	  // expect(output.lines).toBeDefined();
    // 	  // expect(output.lines.length).toEqual(1);
    // 	  // var line = output.lines[0];
    // 	  // expect(line.errors).toBeNull();
    //    	// expect(line.success).toBeDefined();
    //     // expect(line.success.length).toEqual(1);

    //     // var nameNode = line.success[0].group;
    //     // var nameRange = line.success[0].grouprange;
    //     // expect(nameNode).toEqual('foo');
    //     // expect(nameRange.start.ch).toEqual(0);
    //     // expect(nameRange.end.ch).toEqual(3);

    //     // var barNode = line.success[0];
    //     // expect(barNode.name).toEqual('bar');
    //     // expect(barNode.range.start.ch).toEqual(4);
    //     // expect(barNode.range.end.ch).toEqual(7);
    // }));
  });
});

