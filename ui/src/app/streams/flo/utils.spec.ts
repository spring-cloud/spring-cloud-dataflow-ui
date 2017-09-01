// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from './render.service';
import { MockMetamodelService } from './mocks/mock.metamodel.service';
import { Utils } from './utils';

import * as _joint from 'jointjs';
const joint : any = _joint;


describe('utils', () => {

  const MOCK_METAMODEL_SERVICE = new MockMetamodelService();
  const RENDER_SERVICE = new RenderService(MOCK_METAMODEL_SERVICE);

  var graph : dia.Graph;

  beforeEach(() => {
    graph = new joint.dia.Graph();
  });

  it('source can be head of stream', () => {
    let node = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(true);
  });

  it('processor cannot be head of stream', () => {
    let node = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(false);
  });

  it('sink cannot be head of stream', () => {
    let node = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('sink').get('console'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, node)).toEqual(false);
  });

  it('tap processor can be head of stream', () => {
    let http = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    let transform = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(false);
    let link = Shapes.Factory.createLink({
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
      props: new Map<string,any>().set('isTapLink', 'true')
    });
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(true);
    link.remove();
    expect(Utils.canBeHeadOfStream(graph, transform)).toEqual(false);
  });

  it('generate stream name when no other streams present', () => {
    let http = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    let transform = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    expect(Utils.generateStreamName(graph, transform)).toEqual('STREAM_1');
  });

  it('generate stream name when the same stream name is not active', () => {
    let http = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    let transform = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('processor').get('transform'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    transform.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('STREAM_1');
  });

  it('generate stream name when the same stream name is active', () => {
    let http = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    http.attr('stream-name', 'STREAM_1');
    let filewatch = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('filewatch'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    filewatch.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('STREAM_2');
  });

  it('stream already have unique name', () => {
    let http = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    http.attr('stream-name', 'unique-name');
    let filewatch = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('filewatch'),
      renderer: RENDER_SERVICE,
      graph: graph,
    });
    filewatch.attr('stream-name', 'STREAM_1');
    expect(Utils.generateStreamName(graph, http)).toEqual('unique-name');
  });

});
