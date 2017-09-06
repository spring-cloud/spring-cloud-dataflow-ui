import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../render.service';
import { MockMetamodelService } from '../mocks/mock-metamodel.service';
import { NodeComponent } from './node.component';
import { Flo, Constants } from 'spring-flo';

import * as _joint from 'jointjs';
const joint: any = _joint;

function createMockView(cell: dia.Element, context?: string): any {
  return {
    model: cell,
    paper: {
      model: {
        get: () => context ? context : Constants.CANVAS_CONTEXT
      },
    }
  };
}

describe('NodeComponent Tests.', () => {

  const MOCK_METAMODEL_SERVICE = new MockMetamodelService();
  const RENDER_SERVICE = new RenderService(MOCK_METAMODEL_SERVICE);

  let graph: dia.Graph;
  let component: NodeComponent;

  beforeEach(() => {
    graph = new joint.dia.Graph();
    component = new NodeComponent();
  });

  it('Component for regular app node', () => {
    const node = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(node);
    expect(component.metaName).toEqual('http');
    expect(component.metaGroup).toEqual('source');
    expect(component.metadata).toEqual(MOCK_METAMODEL_SERVICE.data.get('source').get('http'));
    expect(component.isPropertiesShown).toBeTruthy();
    expect(component.isDisabled).toBeFalsy();
  });

  it('Component for regular app node with description', (done) => {
    const metadata = MOCK_METAMODEL_SERVICE.data.get('source').get('http');
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(node);
    expect(component.metadata).toEqual(metadata);
    expect(component.description).toBeUndefined();
    metadata.description().then(() => {
      expect(component.description).toEqual('Receive HTTP input');
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
    const metadata = MOCK_METAMODEL_SERVICE.data.get('source').get('http');
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
    const metadata = MOCK_METAMODEL_SERVICE.data.get('source').get('http');
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
    const metadata = MOCK_METAMODEL_SERVICE.data.get('source').get('http');
    const properties = new Map<string, any>().set('port', 90);
    const node = Shapes.Factory.createNode({
      metadata: metadata,
      renderer: RENDER_SERVICE,
      graph: graph,
      props: properties
    });
    component.view = createMockView(node);
    expect(component.cannotShowToolTip).toBeFalsy();
    expect(component.isDisabled).toBeFalsy();
    component.cannotShowToolTip = true;
    expect(component.cannotShowToolTip).toBeTruthy();
    expect(component.isDisabled).toBeTruthy();
  });

});
