import { Flo } from 'spring-flo';
import { convertParseResponseToJsonGraph } from './text-to-graph';
import { JsonGraph } from './text-to-graph';
import { Parser } from '../../shared/services/parser';
import * as _ from 'lodash';

describe('text-to-graph', () => {

    let parseResult: Parser.ParseResult;
    let graph: JsonGraph.Graph;
    let node: JsonGraph.Node;
    let link: JsonGraph.Link;

    let fakemetamodel: Map<string, Map<string, Flo.ElementMetadata>>;

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

    // First set of tests don't require a fake Flo - they convert DSL to a JSON graph (not a jointjs graph)
    it('jsongraph: nograph', () => {
        const dsl = '';
        parseResult = Parser.parse(dsl, 'stream');
        const holder: JsonGraph.GraphHolder = convertParseResponseToJsonGraph(dsl, parseResult);
        expect(holder.errors.length).toEqual(0);
        expect(holder.graph).toBeNull();
    });

    it('jsongraph: error - no more data', () => {
        const dsl = 'time | ';
        parseResult = Parser.parse(dsl, 'stream');
        const holder: JsonGraph.GraphHolder = convertParseResponseToJsonGraph(dsl, parseResult);
        expect(holder.errors[0].message).toEqual('Out of data');
    });

    it('jsongraph: two streams sharing a destination', () => {
        graph = getGraph('time > :abc\nfile > :abc');
        expect(graph.streamdefs[0].def).toEqual('time > :abc');
        expect(graph.streamdefs[1].def).toEqual('file > :abc');
        expect(graph.nodes[0].name).toEqual('time');
        expect(graph.nodes[0]['stream-id']).toEqual(1);
        expect(graph.nodes[1].name).toEqual('destination');
        expect(graph.nodes[1]['stream-id']).toBeUndefined();
        expect(graph.nodes[2].name).toEqual('file');
        expect(graph.nodes[2]['stream-id']).toEqual(2);
        expect(graph.links.length).toEqual(2);
        expect(graph.links[0].from).toEqual(0);
        expect(graph.links[0].to).toEqual(1);
        expect(graph.links[1].from).toEqual(2);
        expect(graph.links[1].to).toEqual(1);
    });

    it('jsongraph: tapping a stream', () => {
        graph = getGraph('aaaa= time | log\n:aaaa.time>log');
        expect(graph.streamdefs[0].def).toEqual('time | log');
        expect(graph.streamdefs[0].name).toEqual('aaaa');
        expect(graph.streamdefs[1].def).toEqual(':aaaa.time > log');
        expect(graph.nodes[0].name).toEqual('time');
        expect(graph.nodes[0]['stream-name']).toEqual('aaaa');
        expect(graph.nodes[1].name).toEqual('log');
        expect(graph.nodes[1]['stream-id']).toBeUndefined();
        expect(graph.nodes[2].name).toEqual('log');
        expect(graph.nodes[2]['stream-id']).toEqual(2);
        expect(graph.links.length).toEqual(2);
        expect(graph.links[0].from).toEqual(0);
        expect(graph.links[0].to).toEqual(1);
        expect(graph.links[1].from).toEqual(0);
        expect(graph.links[1].to).toEqual(2);
        expect(graph.links[1].linkType).toEqual('tap');
    });

    it('jsongraph: tapping a non-existent stream', () => {
        graph = getGraph(':aaaa.time>log');
        expect(graph.streamdefs[0].def).toEqual(':aaaa.time > log');
        expect(graph.nodes[0].name).toEqual('tap');
        expect(graph.nodes[0].properties.get('name')).toEqual('aaaa.time');
        expect(graph.nodes[0]['stream-id']).toBeUndefined();
        expect(graph.nodes[1].name).toEqual('log');
        expect(graph.nodes[1]['stream-id']).toEqual(1);
        expect(graph.links.length).toEqual(1);
        expect(graph.links[0].from).toEqual(0);
        expect(graph.links[0].to).toEqual(1);
    });

    it('jsongraph: incomplete stream with tap', () => {
        graph = getGraph('STREAM_1=time\n:STREAM_1.time > log');
        expect(graph.streamdefs[0].def).toEqual('time');
        expect(graph.streamdefs[1].def).toEqual(':STREAM_1.time > log');
        expect(graph.nodes[0].name).toEqual('time');
        expect(graph.nodes[0]['stream-id']).toEqual(1);
        expect(graph.nodes[1].name).toEqual('log');
        expect(graph.nodes[1]['stream-id']).toEqual(2);
        expect(graph.links.length).toEqual(1);
        expect(graph.links[0].from).toEqual(0);
        expect(graph.links[0].to).toEqual(1);
        expect(graph.links[0].linkType).toEqual('tap');
    });

    it('jsongraph: name set on sink channel in some cases', () => {
        graph = getGraph(':aaa > :foo\n:aaa > :bar');
        expect(graph.streamdefs[0].def).toEqual(':aaa > :foo');
        expect(graph.streamdefs[1].def).toEqual(':aaa > :bar');
        node = graph.nodes[0];
        expect(node.name).toEqual('destination');
        expect(node.properties.get('name')).toEqual('aaa');
        expect(node['stream-id']).toBeUndefined();
        node = graph.nodes[1];
        expect(node.name).toEqual('destination');
        expect(node.properties.get('name')).toEqual('foo');
        expect(node['stream-id']).toEqual(1);
        node = graph.nodes[2];
        expect(node.name).toEqual('destination');
        expect(node.properties.get('name')).toEqual('bar');
        expect(node['stream-id']).toEqual(2);

        expect(graph.links.length).toEqual(2);
        expect(graph.links[0].from).toEqual(0);
        expect(graph.links[0].to).toEqual(1);
        expect(graph.links[1].from).toEqual(0);
        expect(graph.links[1].to).toEqual(2);
    });

    it('jsongraph: basic', () => {
        graph = getGraph('time | log');
        expect(graph.format).toEqual('scdf');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(2);
        expect(graph.links.length).toEqual(1);

        expect(graph.streamdefs[0].name).toEqual('');
        expect(graph.streamdefs[0].def).toEqual('time | log');

        node = graph.nodes[0];
        expect(node.id).toEqual(0);
        expect(node.name).toEqual('time');
        expect(node['stream-id']).toEqual(1);
        expectRange(node.range, 0, 0, 4, 0);

        node = graph.nodes[1];
        expect(node.id).toEqual(1);
        expect(node.name).toEqual('log');
        expect(node['stream-id']).toBeUndefined();
        expectRange(node.range, 7, 0, 10, 0);

        link = graph.links[0];
        expect(link.from).toEqual(0);
        expect(link.to).toEqual(1);
    });

    it('jsongraph: basic labels', () => {
        graph = getGraph('aaa: time | bbb: log');
        expect(graph.format).toEqual('scdf');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(2);
        expect(graph.links.length).toEqual(1);

        expect(graph.streamdefs[0].name).toEqual('');
        expect(graph.streamdefs[0].def).toEqual('aaa: time | bbb: log');

        node = graph.nodes[0];
        expect(node.id).toEqual(0);
        expect(node.name).toEqual('time');
        expect(node.label).toEqual('aaa');
        expect(node['stream-id']).toEqual(1);
        expectRange(node.range, 0, 0, 9, 0);

        node = graph.nodes[1];
        expect(node.id).toEqual(1);
        expect(node.name).toEqual('log');
        expect(node.label).toEqual('bbb');
        expect(node['stream-id']).toBeUndefined();
        expectRange(node.range, 12, 0, 20, 0);

        link = graph.links[0];
        expect(link.from).toEqual(0);
        expect(link.to).toEqual(1);
    });

    it('jsongraph: properties', () => {
        graph = getGraph('time --aaa=bbb --ccc=ddd | log');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(2);
        expect(graph.links.length).toEqual(1);

        expect(graph.streamdefs[0].name).toEqual('');
        expect(graph.streamdefs[0].def).toEqual('time --aaa=bbb --ccc=ddd | log');

        node = graph.nodes[0];
        expect(node.id).toEqual(0);
        expect(node.name).toEqual('time');
        expect(node['stream-id']).toEqual(1);
        expect(node.properties.get('aaa')).toEqual('bbb');
        expectRange(node.propertiesranges.get('aaa'), 5, 0, 14, 0);
        expect(node.properties.get('ccc')).toEqual('ddd');
        expect(node.properties.get('fff')).toBeUndefined();
        expectRange(node.propertiesranges.get('ccc'), 15, 0, 24, 0);
        expectRange(node.range, 0, 0, 4, 0);

        node = graph.nodes[1];
        expect(node.id).toEqual(1);
        expect(node.name).toEqual('log');
        expect(node['stream-id']).toBeUndefined();
        expectRange(node.range, 27, 0, 30, 0);

        link = graph.links[0];
        expect(link.from).toEqual(0);
        expect(link.to).toEqual(1);
    });

    it('jsongraph: source channel', () => {
        graph = getGraph(':abc > log');
        expect(graph.format).toEqual('scdf');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(2);
        expect(graph.links.length).toEqual(1);

        expect(graph.streamdefs[0].name).toEqual('');
        expect(graph.streamdefs[0].def).toEqual(':abc > log');

        node = graph.nodes[0];
        expect(node.id).toEqual(0);
        expect(node.name).toEqual('destination');
        expect(node.properties.get('name')).toEqual('abc');
        expect(node['stream-id']).toBeUndefined(); // destination source doesn't get an ID
        expect(node.range).toBeUndefined(); // this is not set right now for channels

        node = graph.nodes[1];
        expect(node.id).toEqual(1);
        expect(node.name).toEqual('log');
        expect(node['stream-id']).toEqual(1);
        expectRange(node.range, 7, 0, 10, 0);

        link = graph.links[0];
        expect(link.from).toEqual(0);
        expect(link.to).toEqual(1);
    });

    it('jsongraph: sink channel', () => {
        graph = getGraph('time > :abc');
        expect(graph.format).toEqual('scdf');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(2);
        expect(graph.links.length).toEqual(1);

        expect(graph.streamdefs[0].name).toEqual('');
        expect(graph.streamdefs[0].def).toEqual('time > :abc');

        node = graph.nodes[0];
        expect(node.id).toEqual(0);
        expect(node.name).toEqual('time');
        expect(node['stream-id']).toEqual(1);
        expectRange(node.range, 0, 0, 4, 0);

        node = graph.nodes[1];
        expect(node.id).toEqual(1);
        expect(node.name).toEqual('destination');
        expect(node.properties.get('name')).toEqual('abc');
        expect(node['stream-id']).toBeUndefined();
        expect(node.range).toBeUndefined();

        link = graph.links[0];
        expect(link.from).toEqual(0);
        expect(link.to).toEqual(1);
    });

    function getGraph(dsl: string) {
        parseResult = Parser.parse(dsl, 'stream');
        return convertParseResponseToJsonGraph(dsl, parseResult).graph;
    }

    function expectRange(range: JsonGraph.Range, startChar: number, startLine: number, endChar: number, endLine: number) {
        expect(range.start.ch).toEqual(startChar);
        expect(range.start.line).toEqual(startLine);
        expect(range.end.ch).toEqual(endChar);
        expect(range.end.line).toEqual(endLine);
    }

});
