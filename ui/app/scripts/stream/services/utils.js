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
 * @author Alex Boyko
 */
define(function () {
    'use strict';

    function canBeHeadOfStream(graph, element) {
        if (!element.attr('.input-port') || element.attr('.input-port/display') === 'none') {
            return true;
        } else {
            var incoming = graph.getConnectedLinks(element, { inbound: true });
            if (incoming.length === 1 && incoming[0].get('source').port === 'tap') {
                // If module has one incoming link and its from a tap port then module is a start of a tap stream
                return true;
            }
        }
        return false;
    }

    function generateStreamName(graph, element) {
        var streamNames = [];
        graph.getElements().forEach(function(e) {
           if (element !== e && e.attr('stream-name') && canBeHeadOfStream(graph, e)) {
               streamNames.push(e.attr('stream-name'));
           }
        });

        // Check if current element stream name is unique
        if (element && element.attr('stream-name') && streamNames.index(element.attr('stream-name')) === -1) {
            return element.attr('stream-name');
        }

        var name = 'STREAM_', index = 1;
        while (streamNames.indexOf(name + index) >= 0) {
            index++;
        }
        return name + index;
    }

    return {
        'canBeHeadOfStream': canBeHeadOfStream,
        'generateStreamName': generateStreamName
    };
});
