import { Flo } from 'spring-flo';
import { convertParseResponseToJsonGraph } from './text-to-graph';
import { JsonGraph, TextToGraphConverter } from './text-to-graph';
import { Parser } from '../../../shared/services/parser';

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

    it('jsongraph: two separate apps should be unconnected', () => {
        graph = getGraph('aaa|| bbb');
        expect(graph.streamdefs.length).toEqual(1);
        expect(graph.streamdefs[0].def).toEqual('aaa || bbb');
        expect(graph.nodes[0].name).toEqual('aaa');
        expect(graph.nodes[0].group).toEqual('app');
        expect(graph.nodes[1].name).toEqual('bbb');
        expect(graph.nodes[1].group).toEqual('app');
        expect(graph.links.length).toEqual(0);
    });

    it('jsongraph: app properties computed dsl', () => {
      const dsl = 'aaa --server.port=9002 --server.addr=uuu||bbb --server.port=4567';
      graph = getGraph('aaa --server.port=9002 --server.addr=uuu||bbb --server.port=4567');
      expect(graph.links.length).toEqual(0);
      expect(graph.streamdefs.length).toEqual(1);
      expect(graph.streamdefs[0].def).toEqual('aaa --server.port=9002 --server.addr=uuu || bbb --server.port=4567');
    });

    it('jsongraph: two separate apps should be unconnected: 2', () => {
        graph = getGraph('aaa || bbb');
        expect(graph.streamdefs.length).toEqual(1);
        expect(graph.streamdefs[0].def).toEqual('aaa || bbb');
        expect(graph.nodes[0].name).toEqual('aaa');
        expect(graph.nodes[0].group).toEqual('app');
        expect(graph.nodes[1].name).toEqual('bbb');
        expect(graph.nodes[1].group).toEqual('app');
        expect(graph.links.length).toEqual(0);
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

    it('incorrect tap link - gh514', () => {
        graph = getGraph('STREAM_1=ftp | filter > :foo\n' +
                         'STREAM_2=:STREAM_1.ftp > splitter > :foo\n' +
                         'STREAM_3=:foo > log');
        expect(graph.format).toEqual('scdf');
        expect(graph.errors).toBeUndefined();
        expect(graph.nodes.length).toEqual(5);
        expect(graph.links.length).toEqual(5);

        expect(graph.nodes[0].name).toEqual('ftp');
        expect(graph.nodes[1].name).toEqual('filter');
        expect(graph.nodes[2].name).toEqual('destination');
        expect(graph.nodes[2].properties.get('name')).toEqual('foo');
        expect(graph.nodes[3].name).toEqual('splitter');
        expect(graph.nodes[4].name).toEqual('log');

        expect(toString(graph.links[0])).toEqual('0 -> 1');
        expect(toString(graph.links[1])).toEqual('1 -> 2');
        expect(toString(graph.links[2])).toEqual('0 -> 3 [tap]');
        expect(toString(graph.links[3])).toEqual('3 -> 2');
        expect(toString(graph.links[4])).toEqual('2 -> 4');
    });

    function toString(aLink: JsonGraph.Link): string {
        return aLink.from + ' -> ' + aLink.to + (aLink.linkType === 'tap' ? ' [tap]' : '');
    }

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

    it('group selection', () => {
      const metamodel: Map<string, Map<string, Flo.ElementMetadata>> = new Map<string, Map<string, Flo.ElementMetadata>>();
      metamodel.set('processor', new Map<string, Flo.ElementMetadata>([['counter', createEntry('processor', 'counter')]]));
      metamodel.set('source', new Map<string, Flo.ElementMetadata>([['counter', createEntry('source', 'counter')]]));
      metamodel.set('sink', new Map<string, Flo.ElementMetadata>([['counter', createEntry('sink', 'counter')]]));
      const converter: any = new TextToGraphConverter('', null, metamodel);
      expect(converter.matchGroup('counter', 1, 1)).toEqual('processor');
      expect(converter.matchGroup('counter', 3, 2)).toEqual('processor');
      expect(converter.matchGroup('counter', 1, 0)).toEqual('sink');
      expect(converter.matchGroup('counter', 3, 0)).toEqual('sink');
      expect(converter.matchGroup('counter', 0, 1)).toEqual('source');
      expect(converter.matchGroup('counter', 0, 3)).toEqual('source');
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

  function createEntry(group: string, name: string): Flo.ElementMetadata {
    return {
      group: group,
      name: name,
      get(property: String): Promise<Flo.PropertyMetadata> {
        return Promise.resolve(null);
      },
      properties(): Promise<Map<string, Flo.PropertyMetadata>> {
        return Promise.resolve(new Map());
      }
    };
  }

});
