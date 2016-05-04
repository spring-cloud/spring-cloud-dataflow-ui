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
