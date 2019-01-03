
import { dia } from 'jointjs';
import * as _ from 'lodash';
import { Flo } from 'spring-flo';
import { convertGraphToText } from './graph-to-text';
import { JsonGraph } from './text-to-graph';

import { Shapes } from 'spring-flo';

import * as _joint from 'jointjs';
const joint: any = _joint;

describe('graph-to-text', () => {

    let fakemetamodel: Map<string, Map<string, Flo.ElementMetadata>>;
    let graph: dia.Graph;
    let dsl: string;

    beforeAll(() => {
        const fakeTimeMetadata: Flo.ElementMetadata = {
            'group': 'fake',
            'name': 'time',
            get(property: String): Promise<Flo.PropertyMetadata> {
                return Promise.resolve(null);
            },
            properties(): Promise<Map<string, Flo.PropertyMetadata>> {
                return Promise.resolve(new Map());
            }
        };
        const fakeTime: Map<string, Flo.ElementMetadata> = new Map();
        fakeTime['time'] = fakeTimeMetadata;
        fakemetamodel = new Map();
        fakemetamodel['fake'] = fakeTime;
    });

    beforeEach(() => {
      graph = new dia.Graph();
    });

    it('isolated node (incomplete stream)', () => {
        createSource('time');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time');
    });

    it('isolated destination (incomplete stream)', () => {
        createDestination('lonely');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':lonely');
    });

    it('incorrect graph - no tap links from channels', () => {
        createTap(createDestination('a'), createDestination('b'));
        try {
            dsl = convertGraphToText(graph);
            fail('expected an error to occur');
        } catch (err) {
            expect(err.msg).toEqual('no tap links from channels');
        }
    });

    it('incorrect graph - single node tapped into', () => {
        const timeSource = createSource('time');
        const logSink = createSink('log');
        createTap(timeSource, logSink);
        // 'timeSource' is missing a real connected (not via tap) sink
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('STREAM_1=time\n:STREAM_1.time > log');
    });

    it('incorrect graph - no tap links from channels', () => {
        const d = createDestination('d');
        createLink(createSource('time'), d);
        createTap(d, createSink('log'));
        try {
            dsl = convertGraphToText(graph);
            fail('expected an error to occur');
        } catch (err) {
            expect(err.msg).toEqual('no tap links from channels');
        }
    });

    it('basic - one simple stream', () => {
        createLink(createSource('time'), createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time | log');
    });

    it('basic - one simple stream with props', () => {
        const timeSource = createSource('time');
        setProperties(timeSource, new Map([['aaa', 'bbb']]));
        createLink(timeSource, createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time --aaa=bbb | log');
    });

    it('non stream apps 1', () => {
        const appA = createApp('appA');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('appA');
    });

    it('non stream apps 2', () => {
        const appA = createApp('appA');
        const appB = createApp('appB');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('appA || appB');
    });

    it('non stream apps with properties', () => {
        const appA = createApp('appA');
        setProperties(appA, new Map([['aaa', 'bbb']]));
        const appB = createApp('appB');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('appA --aaa=bbb || appB');
    });

    it('non stream apps with properties 2', () => {
        const appA = createApp('appA');
        setProperties(appA, new Map([['aaa', 'bbb']]));
        const appB = createApp('appB');
        const appC = createApp('appC');
        setProperties(appC, new Map([['ccc', 'ddd']]));
        setProperties(appC, new Map([['eee', 'fff']]));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('appA --aaa=bbb || appB || appC --ccc=ddd --eee=fff');
    });

    it('mix apps/streams on graph', () => {
        const timeSource = createSource('time');
        setProperties(timeSource, new Map([['aaa', 'bbb'], ['ccc', 'ddd']]));
        const logSink = createSink('log');
        setProperties(logSink, new Map([['eee', 'fff']]));
        createLink(timeSource, logSink);
        const appA = createApp('appA');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time --aaa=bbb --ccc=ddd | log --eee=fff\nappA');
    });

    it('non stream apps stream-name on first node', () => {
      const appA = createApp('appA');
      const appB = createApp('appB');
      appA.attr('stream-name', 'stream-1');
      dsl = convertGraphToText(graph);
      expect(dsl).toEqual('stream-1=appA || appB');
    });

    it('non stream apps stream-name on second node', () => {
      const appA = createApp('appA');
      const appB = createApp('appB');
      appB.attr('stream-name', 'stream-1');
      dsl = convertGraphToText(graph);
      expect(dsl).toEqual('stream-1=appB || appA');
    });

    it('basic - multiple properties', () => {
        const timeSource = createSource('time');
        setProperties(timeSource, new Map([['aaa', 'bbb'], ['ccc', 'ddd']]));
        const logSink = createSink('log');
        setProperties(logSink, new Map([['eee', 'fff']]));
        createLink(timeSource, logSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time --aaa=bbb --ccc=ddd | log --eee=fff');
    });

    it('basic - multiple properties - ranges', () => {
        const timeSource = createSource('time');
        setProperties(timeSource, new Map([['aaa', 'bbb'], ['ccc', 'ddd']]));
        const logSink = createSink('log');
        setProperties(logSink, new Map([['eee', 'fff']]));
        createLink(timeSource, logSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time --aaa=bbb --ccc=ddd | log --eee=fff');


        const timeSourceRange: JsonGraph.Range = timeSource.attr('range');
        expect(timeSourceRange).toBeDefined();
        expect(timeSourceRange.start.ch).toEqual(0);
        expect(timeSourceRange.start.line).toEqual(0);
        expect(timeSourceRange.end.ch).toEqual(24);
        expect(timeSourceRange.end.line).toEqual(0);

        const logSinkRange: JsonGraph.Range = logSink.attr('range');
        expect(logSinkRange).toBeDefined();
        expect(logSinkRange.start.ch).toEqual(27);
        expect(logSinkRange.start.line).toEqual(0);
        expect(logSinkRange.end.ch).toEqual(40);
        expect(logSinkRange.end.line).toEqual(0);

        const properties = timeSource.attr('props');
        expect(properties['aaa']).toEqual('bbb');
        expect(logSink.attr('props')['eee']).toEqual('fff');

        let propertiesRanges: Map<string, JsonGraph.Range> = timeSource.attr('propertiesranges');
        expect(propertiesRanges).toBeDefined();
        let propRange: JsonGraph.Range = propertiesRanges.get('aaa');
        expect(propRange.start.ch).toEqual(5);
        expect(propRange.start.line).toEqual(0);
        expect(propRange.end.ch).toEqual(14);
        expect(propRange.end.line).toEqual(0);
        propRange = propertiesRanges.get('ccc');
        expect(propRange.start.ch).toEqual(15);
        expect(propRange.start.line).toEqual(0);
        expect(propRange.end.ch).toEqual(24);
        expect(propRange.end.line).toEqual(0);

        propertiesRanges = logSink.attr('propertiesranges');
        expect(propertiesRanges).toBeDefined();
        propRange = propertiesRanges.get('eee');
        expect(propRange.start.ch).toEqual(31);
        expect(propRange.start.line).toEqual(0);
        expect(propRange.end.ch).toEqual(40);
        expect(propRange.end.line).toEqual(0);
    });

    it('basic - multiple properties - multiple lines - ranges', () => {
        const timeSource = createSource('time');
        setProperties(timeSource, new Map([['aaa', 'bbb']]));
        const logSink = createSink('log');
        createLink(timeSource, logSink);
        const timeSource2 = createSource('time');
        setProperties(timeSource2, new Map([['xxxxx', 'yy']]));
        const logSink2 = createSink('log');
        createLink(timeSource2, logSink2);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time --aaa=bbb | log\ntime --xxxxx=yy | log');

        const timeSource2Range: JsonGraph.Range = timeSource2.attr('range');
        expect(timeSource2Range).toBeDefined();
        expect(timeSource2Range.start.ch).toEqual(0);
        expect(timeSource2Range.start.line).toEqual(1);
        expect(timeSource2Range.end.ch).toEqual(15);
        expect(timeSource2Range.end.line).toEqual(1);

        expect(timeSource2.attr('props')['xxxxx']).toEqual('yy');

        const propertiesRanges: Map<string, JsonGraph.Range> = timeSource2.attr('propertiesranges');
        expect(propertiesRanges).toBeDefined();
        const propRange: JsonGraph.Range = propertiesRanges.get('xxxxx');
        expect(propRange.start.ch).toEqual(5);
        expect(propRange.start.line).toEqual(1); // should be line 1
        expect(propRange.end.ch).toEqual(15);
        expect(propRange.end.line).toEqual(1);
    });

    it('labels', () => {
        const timeSource = createSource('time');
        setLabel(timeSource, 'banana');
        createLink(timeSource, createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('banana: time | log');
    });

    it('tapping an un-named stream forces it to get a name', () => {
        const timeSource = createSource('time');
        createLink(timeSource, createSink('logA'));
        createTap(timeSource, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('STREAM_1=time | logA\n:STREAM_1.time > logB');
    });

    it('tap node (tapping something not on the graph)', () => {
        const tapSource = createTapNode('aaaa.time');
        createLink(tapSource, createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':aaaa.time > log');
    });

    it('just a tap node (tapping something not on the graph)', () => {
        const tapSource = createTapNode('aaaa.time');
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':aaaa.time >');
    });

    it('multiple streams getting names', () => {
        const timeSource1 = createSource('timeA');
        const timeSource2 = createSource('timeB');
        createLink(timeSource1, createSink('logA'));
        createTap(timeSource1, createSink('logB'));
        createTap(timeSource2, createSink('logC'));
        createLink(timeSource2, createSink('logD'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('STREAM_1=timeA | logA\n:STREAM_1.timeA > logB\n:STREAM_4.timeB > logC\nSTREAM_4=timeB | logD');
    });

    it('finding names further away', () => {
        const timeSource1 = createSource('timeA');
        const transformProcessor = createProcessor('transform');
        const logSink1 = createSink('logA');
        const logSink2 = createSink('logB');
        createLink(timeSource1, transformProcessor);
        createLink(transformProcessor, logSink1);
        createTap(transformProcessor, logSink2);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('STREAM_1=timeA | transform | logA\n:STREAM_1.transform > logB');
    });

    it('bridge name', () => {
        const inputDestination = createDestination('input');
        const outputDestination = createDestination('output');
        setStreamName(outputDestination, 'foo');
        createLink(inputDestination, outputDestination);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=:input > :output');
    });

    it('bridge name in complex flo 1', () => {
        const timeSource = createSource('time');
        const logSink = createSink('log');
        const inputDestination = createDestination('input');
        const outputDestination = createDestination('output');
        setStreamName(outputDestination, 'foo');
        createLink(timeSource, inputDestination);
        createLink(outputDestination, logSink);
        createLink(inputDestination, outputDestination);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time > :input\nfoo=:input > :output\n:output > log');
    });

    // Here destinations are being used since they cause names
    // to be on following nodes (since destinations can
    // have mutiple outputs)
    it('bridge name in complex flo 2', () => {
        const a = createDestination('A');
        const b = createDestination('B');
        const c = createDestination('C');
        const d = createDestination('D');
        setStreamName(b, 'one');
        setStreamName(c, 'two');
        setStreamName(d, 'three');
        createLink(a, b);
        createLink(b, c);
        createLink(c, d);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('one=:A > :B\ntwo=:B > :C\nthree=:C > :D');
    });

    it('not yet named destination', () => {
        const d = createNode('destination', 'destination');
        const sink = createSink('log');
        createLink(d, sink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':undefined > log');
    });

    it('names when fanout', () => {
        const a = createDestination('A');
        const b1 = createDestination('B1');
        const b2 = createDestination('B2');
        setStreamName(b1, 'one');
        setStreamName(b2, 'two');
        createLink(a, b1);
        createLink(a, b2);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('one=:A > :B1\ntwo=:A > :B2');
    });

    // A > :B      :B > C | D     :XX.C > E
    it('does the right node get named for the tap', () => {
        const a = createSource('A');
        const b = createDestination('B');
        const c = createProcessor('C');
        const d = createSink('D');
        const e = createSink('E');
        createLink(a, b);
        createLink(b, c);
        createLink(c, d);
        createTap(c, e);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('A > :B\nSTREAM_2=:B > C | D\n:STREAM_2.C > E');
    });

    it('ensuring name set on correct element', () => {
        const timeSource1 = createSource('timeA');
        const transformProcessor = createProcessor('transform');
        const logSink1 = createSink('logA');
        const logSink2 = createSink('logB');
        createLink(timeSource1, transformProcessor);
        createLink(transformProcessor, logSink1);
        createTap(transformProcessor, logSink2);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('STREAM_1=timeA | transform | logA\n:STREAM_1.transform > logB');
    });

    it('labels and taps', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        setLabel(timeSource, 'apple');
        createLink(timeSource, createSink('logA'));
        createTap(timeSource, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=apple: time | logA\n:foo.apple > logB');
    });

    it('basic - two simple streams', () => {
        createLink(createSource('time1'), createSink('log1'));
        createLink(createSource('time2'), createSink('log2'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time1 | log1\ntime2 | log2');
    });

    it('basic - link editing in process (invalid target id)', () => {
        const source = createSource('time');
        const linkParams: Shapes.LinkCreationParams = {
            source: {'id': source.id, 'port': 'output', 'selector': '.output-port'},
            target: {'id': 'not-exist', 'port': 'input', 'selector': '.input-port'}
        };
        const link = Shapes.Factory.createLink(linkParams);
        graph.addCell(link);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time');
    });

    it('basic - link editing in process (no target id)', () => {
        const source = createSource('time');
        const linkParams = {
            source: {'id': source.id, 'port': 'output', 'selector': '.output-port'},
            target: {'id': null, 'port': 'input', 'selector': '.input-port'}
        };
        const link = Shapes.Factory.createLink(linkParams);
        graph.addCell(link);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time');
    });

    it('basic - source processor sink', () => {
        const timeSource = createSource('time');
        const transformProcessor = createProcessor('transform');
        const logSink = createSink('log');
        createLink(timeSource, transformProcessor);
        createLink(transformProcessor, logSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time | transform | log');
    });

    it('basic - source to channel', () => {
        createLink(createSource('time'), createDestination('dest'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time > :dest');
    });

    it('named stream', () => {
        const timeSource = createSource('time');
        timeSource.attr('stream-name', 'aaa');
        createLink(timeSource, createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('aaa=time | log');
    });

    it('tapped simple stream', () => {
        const timeSource = createSource('time');
        timeSource.attr('stream-name', 'aaa');
        createLink(timeSource, createSink('logA'));
        createTap(timeSource, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('aaa=time | logA\n:aaa.time > logB');
    });

    it('tapped simple stream 2', () => {
        const timeSource = createSource('time');
        timeSource.attr('stream-name', 'aaa');
        // Now the tap is the first one, not the second one
        createTap(timeSource, createSink('logA'));
        createLink(timeSource, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':aaa.time > logA\naaa=time | logB');
    });

    it('tap into processor', () => {
        const timeSource = createSource('time');
        timeSource.attr('stream-name', 'aaa');
        const transformProcessor = createProcessor('transform');
        createLink(timeSource, transformProcessor);
        createLink(transformProcessor, createSink('logA'));
        createTap(transformProcessor, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('aaa=time | transform | logA\n:aaa.transform > logB');
    });

    it('channel with links out to two sinks', () => {
        const fooChannel = createDestination('foo');
        createLink(fooChannel, createSink('logA'));
        createLink(fooChannel, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':foo > logA\n:foo > logB');
    });

    it('source connected to channel, further connected to two sinks', () => {
        const timeSource = createSource('time');
        const fooChannel = createDestination('foo');
        createLink(timeSource, fooChannel);
        createLink(fooChannel, createSink('logA'));
        createLink(fooChannel, createSink('logB'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time > :foo\n:foo > logA\n:foo > logB');
    });

    it('two streams joined by destination', () => {
        const timeSource = createSource('time');
        const fooChannel = createDestination('foo');
        const logSink = createSink('log');
        createLink(timeSource, fooChannel);
        createLink(fooChannel, logSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time > :foo\n:foo > log');
    });

    it('two streams: regular one and tap one into destination', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        const fileSink = createSink('file');
        const timefileLink = createLink(timeSource, fileSink);
        const intermediateDestination = createDestination('ddd');
        const link1 = createTap(timeSource, intermediateDestination);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=time | file\n:foo.time > :ddd');
    });

    it('three streams with destination between two of them', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        const fileSink = createSink('file');
        const timefileLink = createLink(timeSource, fileSink);
        const intermediateDestination = createDestination('intermediate');
        const logSink = createSink('log');
        const link1 = createTap(timeSource, intermediateDestination);
        const link2 = createLink(intermediateDestination, logSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=time | file\n:foo.time > :intermediate\n:intermediate > log');
    });

    it('building a stream then a separate tap', () => {
        const timeSource = createSource('time');
        createLink(timeSource, createSink('log'));
        expect(convertGraphToText(graph)).toEqual('time | log');
        setStreamName(timeSource, 'foo');
        expect(convertGraphToText(graph)).toEqual('foo=time | log');
        const tapNode = createTapNode('foo.time');
        expect(convertGraphToText(graph)).toEqual('foo=time | log\n:foo.time >');
        createLink(tapNode, createSink('log'));
        expect(convertGraphToText(graph)).toEqual('foo=time | log\n:foo.time > log');
    });

    it('fanout - destination source to two sinks', () => {
        const d1 = createDestination('d1');
        const logSink = createSink('log');
        const link  = createLink(d1, logSink);
        const fileSink = createSink('file');
        const link2 = createLink(d1, fileSink);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(':d1 > log\n:d1 > file');
    });

    it('fanin - two sources to one destination', () => {
        const d = createDestination('d');
        createLink(createSource('time'), d);
        createLink(createSource('file'), d);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('time > :d\nfile > :d');
    });

    // The next tests are building up a graph over a number of steps (each
    // builds on the last). The final graph should be:
    // a time source connected to four things. A cassandra sink, tapped to a jdbc
    // sink, tapped to a websocket sink and tapped to a time-log destination. The
    // time-log destination is tapped to a log sink and attached to a throughput sink.

    // stage 1: just the time | cassandra stream (named foo)
    it('fanout - building up complex graph - stage 1', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        createLink(timeSource, createSink('cassandra'));

        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=time | cassandra');
    });

    // stage 2 - as above but add tap streams to jdbc and websocket sinks
    it('fanout - building up complex graph - stage 2', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        createLink(timeSource, createSink('cassandra'));
        createTap(timeSource, createSink('jdbc'));
        createTap(timeSource, createSink('websocket'));

        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=time | cassandra\n:foo.time > jdbc\n:foo.time > websocket');
    });

    // add tap to time-log destination from time
    it('fanout - building up complex graph - stage 3', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        createLink(timeSource, createSink('cassandra'));
        createTap(timeSource, createSink('jdbc'));
        createTap(timeSource, createSink('websocket'));
        const timelogDestination = createDestination('time-log');
        createTap(timeSource, timelogDestination);
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual('foo=time | cassandra\n:foo.time > jdbc\n:foo.time > websocket\n:foo.time > :time-log');
    });

    // the time-log destination is now connected to a throughput sink
    it('fanout - building up complex graph - stage 4', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        createLink(timeSource, createSink('cassandra'));
        createTap(timeSource, createSink('jdbc'));
        createTap(timeSource, createSink('websocket'));
        const timelogDestination = createDestination('time-log');
        createTap(timeSource, timelogDestination);
        createLink(timelogDestination, createSink('throughput'));

        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(
            'foo=time | cassandra\n:foo.time > jdbc\n:foo.time > websocket\n:foo.time > :time-log\n:time-log > throughput');
    });

    // the time-log destination is finally additionally tapped to a log
    it('fanout - building up complex graph - stage 5', () => {
        const timeSource = createSource('time');
        setStreamName(timeSource, 'foo');
        createLink(timeSource, createSink('cassandra'));
        createTap(timeSource, createSink('jdbc'));
        createTap(timeSource, createSink('websocket'));
        const timelogDestination = createDestination('time-log');
        createTap(timeSource, timelogDestination);
        createLink(timelogDestination, createSink('throughput'));
        createLink(timelogDestination, createSink('log'));
        dsl = convertGraphToText(graph);
        expect(dsl).toEqual(
            'foo=time | cassandra\n:foo.time > jdbc\n:foo.time > websocket\n' +
            ':foo.time > :time-log\n:time-log > throughput\n:time-log > log');
    });

    function setStreamName(node: dia.Element, name: string) {
      node.attr('stream-name', name);
    }

    function createDestination(destinationname: string): dia.Element {
      const newDestinationNode: dia.Element = createNode('destination', 'destination');
      newDestinationNode.attr('props/name', destinationname);
      return newDestinationNode;
    }

    function createTapNode(tappedStreamAndApp: string): dia.Element {
        const newTapNode: dia.Element = createNode('tap', 'tap');
        newTapNode.attr('props/name', tappedStreamAndApp);
        return newTapNode;
    }

    function createApp(appname: string): dia.Element {
        return createNode(appname, 'app');
    }

    function createSource(appname: string): dia.Element {
      return createNode(appname, 'source');
    }

    function createProcessor(appname: string): dia.Element {
        return createNode(appname, 'processor');
      }

    function createSink(appname: string): dia.Element {
      return createNode(appname, 'sink');
    }

    function getName(element: dia.Cell) {
      return element.attr('metadata/name');
    }

    function setLabel(element: dia.Cell, label: string) {
        element.attr('node-name', label);
    }

    function setProperties(element: dia.Cell, properties: Map<string, string>) {
        Array.from(properties.keys()).forEach((k) => {
            element.attr('props/' + k, properties.get(k));
        });
    }

    function createNode(appname: string, group: string): dia.Element {
      const params: Shapes.ElementCreationParams = {};
      params.metadata = {
        name: appname,
        group: group,
        get(property: String): Promise<Flo.PropertyMetadata> {
            return Promise.resolve(null);
        },
        properties(): Promise<Map<string, Flo.PropertyMetadata>> {
            return Promise.resolve(new Map());
        }
      };
      const newNode: dia.Element = Shapes.Factory.createNode(params);
      graph.addCell(newNode);
      return newNode;
    }

    function createTap(from, to): dia.Link {
      return createLink(from, to, true);
    }

    function createLink(from, to, isTapLink?: boolean): dia.Link {
      const linkParams: Shapes.LinkCreationParams = {
        source: {'id': from.id, 'port': 'output', 'selector': '.output-port'},
        target: {'id': to.id, 'port': 'input', 'selector': '.input-port'}
      };
      const link = Shapes.Factory.createLink(linkParams);
      link.attr('props/isTapLink', isTapLink ? true : false);
      graph.addCell(link);
      return link;
    }

});
