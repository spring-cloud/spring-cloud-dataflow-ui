import {Shapes} from 'spring-flo';
import {dia} from 'jointjs';
import {NodeComponent} from './node-component';
import {Flo, Constants} from 'spring-flo';
import {MockSharedAppService} from '../../../tests/service/app.service.mock';
import {waitForAsync} from '@angular/core/testing';
import {MetamodelService} from '../../stream/metamodel.service';
import {RenderService} from '../../stream/render.service';
import {NodeHelper} from '../../stream/node-helper.service';

import * as _joint from 'jointjs';

const joint: any = _joint;

function createMockView(cell: dia.Element, context?: string): any {
  return {
    model: cell,
    paper: {
      model: {
        get: () => (context ? context : Constants.CANVAS_CONTEXT)
      }
    }
  };
}

class MockDocService {
  mouseDown = false;
  isMouseDown = () => this.mouseDown;
}

describe('NodeComponent Tests.', () => {
  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());
  const RENDER_SERVICE = new RenderService(METAMODEL_SERVICE, new NodeHelper());
  const DOC_SERVICE = new MockDocService();

  let graph: dia.Graph;
  let component: NodeComponent;
  let metamodel: Map<string, Map<string, Flo.ElementMetadata>>;

  beforeEach(
    waitForAsync(() => {
      METAMODEL_SERVICE.load().then(data => (metamodel = data));
      graph = new joint.dia.Graph();
      component = new NodeComponent(<any>DOC_SERVICE);
    })
  );

  it('Component for regular app node', () => {
    const node = Shapes.Factory.createNode({
      metadata: metamodel.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(node);
    expect(component.metaName).toEqual('http');
    expect(component.metaGroup).toEqual('source');
    expect(component.metadata).toEqual(metamodel.get('source').get('http'));
    expect(component.isPropertiesShown).toBeTruthy();
    expect(component.isDisabled).toBeFalsy();
  });

  it('Component for regular app node with description', done => {
    const metadata = metamodel.get('source').get('http');
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(node);
    expect(component.metadata).toEqual(metadata);
    expect(component.description).toBeUndefined();
    metadata.description().then(() => {
      expect(component.description).toEqual(/* 'Receive HTTP input'*/ ''); // No description for app yet
      done();
    });
  });

  it('Unknown app node', () => {
    const metadata: Flo.ElementMetadata = {
      name: 'SomeName',
      group: 'SomeGroup',
      properties: () => Promise.resolve(new Map()),
      get: (property: string) => Promise.resolve(null),
      unresolved: true
    };
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(node);
    expect(component.metadata).toEqual(metadata);
    expect(component.isDisabled).toBeTruthy();
  });

  it('Properties not shown', () => {
    const metadata: Flo.ElementMetadata = {
      name: 'SomeApp',
      group: 'SomeGroup',
      properties: () => Promise.resolve(new Map()),
      get: (property: string) => Promise.resolve(null),
      metadata: {
        'hide-tooltip-options': true
      }
    };
    const properties = new Map<string, any>().set('key1', 'value1');
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph,
      props: properties
    });
    component.view = createMockView(node);
    expect(component.metadata).toEqual(metadata);
    expect(component.isPropertiesShown).toBeFalsy();
  });

  it('App node with properties', () => {
    const metadata = metamodel.get('source').get('http');
    const properties = new Map<string, any>().set('port', 90);
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph,
      props: properties
    });
    component.view = createMockView(node);
    expect(component.getPropertyValue('port')).toEqual(90);
    expect(component.keys(component.allProperties)).toEqual(['port']);
    expect(component.isCode('port')).toBeFalsy();
  });

  it('Palette node', () => {
    const metadata = metamodel.get('source').get('http');
    const properties = new Map<string, any>().set('port', 90);
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph,
      props: properties
    });
    component.view = createMockView(node, Constants.PALETTE_CONTEXT);
    expect(component.isCanvas()).toBeFalsy();
  });

  it('Cannot show tooltip', () => {
    const metadata = metamodel.get('source').get('http');
    const properties = new Map<string, any>().set('port', 90);
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph,
      props: properties
    });
    component.view = createMockView(node);
    expect(component.isDisabled).toBeFalsy();
    DOC_SERVICE.mouseDown = true;
    expect(component.isDisabled).toBeTruthy();
    DOC_SERVICE.mouseDown = false;
    expect(component.isDisabled).toBeFalsy();
  });
});
