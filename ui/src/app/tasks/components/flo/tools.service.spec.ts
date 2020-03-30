import { ToolsService } from './tools.service';
import { Graph, Link, Node } from './model/models';
import { ErrorHandler } from '../../../shared/model/error-handler';
import { of } from 'rxjs';

/**
 * Tests tools service.
 *
 * @author Janne Valkealahti
 */
describe('ToolsService', () => {

  const CONVERSION_RESPONSE_1 = {
    graph: null,
    dsl: 'timestamp',
    errors: []
  };

  const CONVERSION_RESPONSE_2 = {
    graph: {
      nodes: [
        {
          id: '0',
          name: 'START'
        },
        {
          id: '1',
          name: 'timestamp'
        },
        {
          id: '2',
          name: 'END'
        }
      ],
      links: [
        {
          from: '0',
          to: '1'
        },
        {
          from: '1',
          to: '2'
        }
      ]
    },
    dsl: null,
    errors: []
  };
  let mockHttp;
  let jsonData;
  let toolsService;

  beforeEach(() => {
    mockHttp = {
      post: jasmine.createSpy('post')
    };
    jsonData = {};
    const errorHandler = new ErrorHandler();
    toolsService = new ToolsService(mockHttp, errorHandler);
  });

  describe('parseTaskTextToGraph', () => {
    it('should call the tools service to parse dsl to graph', () => {
      mockHttp.post.and.returnValue(of(jsonData));
      toolsService.parseTaskTextToGraph('fakedsl');

      const httpUri1 = mockHttp.post.calls.mostRecent().args[0];
      const body = mockHttp.post.calls.mostRecent().args[1];
      const headerArgs1 = mockHttp.post.calls.mostRecent().args[2].headers;

      expect(httpUri1).toEqual('/tools/parseTaskTextToGraph');
      expect(body).toEqual(`{"dsl":"fakedsl","name":"unknown"}`);
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');

    });
    it('empty DSL case', (done) => {
      toolsService.parseTaskTextToGraph('').toPromise().then(result => {
        expect(result.errors).toEqual([]);
        expect(result.dsl).toEqual('');
        expect(result.graph).toBeDefined();
        expect(result.graph.nodes).toEqual([]);
        expect(result.graph.links).toEqual([]);
        done();
      });
    });
    it('Multi-line DSL case', (done) => {
      const dsl = 'task ||\nanothertask';
      toolsService.parseTaskTextToGraph(dsl).toPromise().then(result => {
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].position).toBe(0);
        expect(result.errors[0].length).toBe(dsl.length);
        expect(result.dsl).toEqual(dsl);
        expect(result.graph).toBeNull();
        done();
      });
    });
  });

  describe('convertTaskGraphToText', () => {
    it('should call the tools service to parse graph to dsl', () => {
      mockHttp.post.and.returnValue(of(jsonData));
      const graph = new Graph(new Array(), new Array());
      toolsService.convertTaskGraphToText(graph);

      const httpUri1 = mockHttp.post.calls.mostRecent().args[0];
      const body = mockHttp.post.calls.mostRecent().args[1];
      const headerArgs1 = mockHttp.post.calls.mostRecent().args[2].headers;

      expect(httpUri1).toEqual('/tools/convertTaskGraphToText');
      expect(body).toEqual(`{"nodes":[],"links":[]}`);
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');
    });
  });

  describe('extractConversionData', () => {
    it('should do correct conversion', () => {
      let taskConversion = toolsService.extractConversionData(CONVERSION_RESPONSE_1);
      expect(taskConversion.dsl).toBe('timestamp');
      taskConversion = toolsService.extractConversionData(CONVERSION_RESPONSE_2);
      expect(taskConversion.graph).toBeTruthy();
      expect(taskConversion.graph.nodes.length).toBe(3);
      expect(taskConversion.graph.links.length).toBe(2);
    });
  });

  describe('model', () => {
    it('graph to json', () => {
      const nodes: Array<Node> = new Array();
      nodes.push(new Node('id1', 'name1'));
      const links: Array<Link> = new Array();
      links.push(new Link('from1', 'to1'));
      const graph = new Graph(nodes, links);
      expect(graph.toJson())
        .toBe('{"nodes":[{"id":"id1","name":"name1"}],"links":[{"from":"from1","to":"to1"}]}');
    });
  });

});
