
import { dia } from 'jointjs';
import { Flo } from 'spring-flo';
import { convertGraphToText } from './graph-to-text';

import { Shapes } from 'spring-flo';

import * as _joint from 'jointjs';
const joint: any = _joint;

describe('graph-to-text', () => {

    var fakemetamodel: Map<string,Map<string,Flo.ElementMetadata>>;
    var graph: dia.Graph;

    beforeAll(() => {
        var fakeTimeMetadata: Flo.ElementMetadata =
        {
        'group': 'fake',
        'name': 'time',
        get(property: String): Promise<Flo.PropertyMetadata> {
            return Promise.resolve(null);
        },
        properties(): Promise<Map<string,Flo.PropertyMetadata>> {
            return Promise.resolve(new Map());
        }
        };
        var fakeTime: Map<string,Flo.ElementMetadata> = new Map();
        fakeTime['time'] = fakeTimeMetadata;
        fakemetamodel = new Map();
        fakemetamodel['fake'] = fakeTime;
    });

    beforeEach(() => {
      graph = new dia.Graph();
    })

    it('basic',()=>{
      var cell1 = createSource('time');
      var cell2 = createSink('log');
      var link  = createLink(cell1, cell2);
      var dsl = convertGraphToText(graph);
      expect(dsl).toEqual('time | log');
    })

    it('named stream',()=>{
      var cell1 = createSource('time');
      cell1.attr('stream-name','aaa');
      var cell2 = createSink('log');
      var link  = createLink(cell1, cell2);
      var dsl = convertGraphToText(graph);
      expect(dsl).toEqual('aaa=time | log');
    })

    it('destination source',()=>{
      var cell1 = createDestination('d1');
      var cell2 = createSink('log');
      var link  = createLink(cell1, cell2);
      var cell3 = createSink('file');
      var link2 = createLink(cell1,cell3,true);
      var dsl = convertGraphToText(graph);
      expect(dsl).toEqual(':d1 > log\n:d1 > file');
    })

    function createDestination(destinationname: string): dia.Element {
      var newDestinationNode: dia.Element = createNode('destination','destination');
      newDestinationNode.attr('props/name',destinationname);
      return newDestinationNode;
    }

    function createSource(appname: string): dia.Element {
      return createNode(appname,'source');
    }

    function createSink(appname: string): dia.Element {
      return createNode(appname,'sink');
    }

    function createNode(appname: string, group: string): dia.Element {
      var params: Shapes.ElementCreationParams = {};
      params.metadata = {
        name: appname,
        group: group,
        get(property: String): Promise<Flo.PropertyMetadata> {
            return Promise.resolve(null);
        },
        properties(): Promise<Map<string,Flo.PropertyMetadata>> {
            return Promise.resolve(new Map());
        }
      };
      var newNode: dia.Element = Shapes.Factory.createNode(params);
      graph.addCell(newNode);
      return newNode;
    }

    function createLink(from, to, isTapLink?: boolean) {
      var linkParams: Shapes.LinkCreationParams = {
        source: {'id': from.id, 'port': 'output', 'selector': '.output-port'},
        target: {'id': to.id, 'port': 'input', 'selector': '.input-port'}
      };
      var link = Shapes.Factory.createLink(linkParams);
      link.attr('props/isTapLink',isTapLink?'true':'false');
      graph.addCell(link);
      return link;
    }

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
});
