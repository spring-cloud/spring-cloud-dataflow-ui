import { Flo, Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../render.service';
import { MetamodelService } from '../metamodel.service';
import { MockSharedAppService } from '../../../../tests/mocks/shared-app';
import { async } from '@angular/core/testing';
import { Utils } from './utils';

import * as _joint from 'jointjs';
const joint: any = _joint;


describe('utils', () => {

  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());
  const RENDER_SERVICE = new RenderService(METAMODEL_SERVICE);

  let graph: dia.Graph;
  let metamodel: Map<string, Map<string, Flo.ElementMetadata>>;

  beforeEach(async(() => {
    graph = new joint.dia.Graph();
    METAMODEL_SERVICE.load().then(data => metamodel = data);
  }));

  it('app can be head of stream', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('http-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(true);
  });

  it('both app can be head of stream', () => {
    const node1 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('http-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const node2 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('file-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node1)).toEqual(true);
    expect(Utils.canBeHeadOfStream(graph, node2)).toEqual(true);
  });

  it('if one app has "stream-name" set others cannot be head of stream', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('time-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    node.attr('stream-name', 'STREAM-1');
    const node1 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('http-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const node2 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('file-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(true);
    expect(Utils.canBeHeadOfStream(graph, node1)).toEqual(false);
    expect(Utils.canBeHeadOfStream(graph, node2)).toEqual(false);
  });

  it('if non-app node has "stream-name" set other app nodes can be head of streams', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const node1 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('http-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const node2 = Shapes.Factory.createNode({
      metadata: metamodel.get('app').get('file-app'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node1)).toEqual(true);
    expect(Utils.canBeHeadOfStream(graph, node2)).toEqual(true);
  });

  it('source can be head of stream', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(true);
  });

  it('processor cannot be head of stream', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(false);
  });

  it('sink cannot be head of stream', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('sink').get('console'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(false);
  });

  it('tap processor can be head of stream', () => {
    const http = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const transform = Shapes.Factory.createNode({
      metadata: metamodel.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(false);
    const link = Shapes.Factory.createLink({
      source: {
        id: http.id,
        port: 'output',
        selector: '.output-port'
      },
      target: {
        id: transform.id,
        port: 'input',
        selector: '.input-port'
      },
      renderer: RENDER_SERVICE,
      graph: graph,
      props: new Map<string, any>().set('isTapLink', true)
    });
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(true);
    link.remove();
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(false);
  });

  it('generate stream name when no other streams present', () => {
    const http = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    const transform = Shapes.Factory.createNode({
      metadata: metamodel.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.generateStreamName(graph, transform)).toEqual('STREAM_1');
  });

  it('generate stream name when the same stream name is not active', () => {
    const http = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    const transform = Shapes.Factory.createNode({
      metadata: metamodel.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    transform.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('STREAM_1');
  });

  it('generate stream name when the same stream name is active', () => {
    const http = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    http.attr('stream-name', 'STREAM_1');
    const filewatch = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('filewatch'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    filewatch.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('STREAM_2');
  });

  it('stream already have unique name', () => {
    const http = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    http.attr('stream-name', 'unique-name');
    const filewatch = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('filewatch'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    filewatch.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('unique-name');
  });

  it('find duplicates: no elements', () => {
    expect(Utils.findDuplicates([])).toEqual([]);
  });

  it('find duplicates: no duplicates', () => {
    expect(Utils.findDuplicates(['1', '2', '3'])).toEqual([]);
  });

  it('find duplicates: multiple duplicates', () => {
    expect(Utils.findDuplicates(['1', '2', '1', '3', '2'])).toEqual(['2', '1']);
  });

  it('find duplicates: multiple duplicates numbers', () => {
    expect(Utils.findDuplicates([1, 2, 1, 3, 2])).toEqual([2, 1]);
  });
});
