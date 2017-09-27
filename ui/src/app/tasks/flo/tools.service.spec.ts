import { Observable } from 'rxjs/Observable';
import { ToolsService } from './tools.service';
import { Graph, Link, Node } from './model/models';
import { ErrorHandler } from '../../shared/model/error-handler';
import { HttpUtils } from '../../shared/support/http.utils';
import { MockResponse } from '../../tests/mocks/response';

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

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['post']);
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    this.toolsService = new ToolsService(this.mockHttp, errorHandler);
  });

  describe('parseTaskTextToGraph', () => {
    it('should call the tools service to parse dsl to graph', () => {
      this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      this.toolsService.parseTaskTextToGraph('fakedsl');
      expect(this.mockHttp.post).toHaveBeenCalledWith('/tools/parseTaskTextToGraph',
        '{"dsl":"fakedsl","name":"unknown"}', requestOptionsArgs);
    });
  });

  describe('convertTaskGraphToText', () => {
    it('should call the tools service to parse graph to dsl', () => {
      this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      const graph = new Graph(new Array(), new Array());
      this.toolsService.convertTaskGraphToText(graph);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/tools/convertTaskGraphToText',
        '{"nodes":[],"links":[]}', requestOptionsArgs);
    });
  });

  describe('extractConversionData', () => {
    it('should do correct conversion', () => {
      const response = new MockResponse();
      response.body = CONVERSION_RESPONSE_1;
      let taskConversion = this.toolsService.extractConversionData(response);
      expect(taskConversion.dsl).toBe('timestamp');

      response.body = CONVERSION_RESPONSE_2;
      taskConversion = this.toolsService.extractConversionData(response);
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
