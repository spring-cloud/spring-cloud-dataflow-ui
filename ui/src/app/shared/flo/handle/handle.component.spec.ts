import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../../../streams/flo/render.service';
import { MockMetamodelService } from '../../../streams/flo/mocks/mock-metamodel.service';
import { HandleComponent } from './handle.component';
import { Constants } from 'spring-flo';

import * as _joint from 'jointjs';
const joint: any = _joint;

function createMockView(cell: dia.Element): any {
  return {
    model: cell,
  };
}

describe('HandleComponent Tests.', () => {

  const MOCK_METAMODEL_SERVICE = new MockMetamodelService();
  const RENDER_SERVICE = new RenderService(MOCK_METAMODEL_SERVICE);

  let graph: dia.Graph;
  let component: HandleComponent;
  let parentNode: dia.Element;

  beforeEach(() => {
    graph = new joint.dia.Graph();
    component = new HandleComponent();
    parentNode = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
  });

  it('No handle view', () => {
    expect(component.placement).toEqual('top');
    expect(component.tooltipText).toBeUndefined();
  });

  it('Remove Handle', () => {
    const removeHandle = Shapes.Factory.createHandle({
      kind: Constants.REMOVE_HANDLE_TYPE,
      parent: parentNode,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(removeHandle);
    expect(component.placement).toEqual('bottom');
    expect(component.tooltipText).toEqual('Remove Element');
  });

  it('Edit Properties Handle', () => {
    const propertiesHandle = Shapes.Factory.createHandle({
      kind: Constants.PROPERTIES_HANDLE_TYPE,
      parent: parentNode,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(propertiesHandle);
    expect(component.placement).toEqual('bottom');
    expect(component.tooltipText).toEqual('Edit Properties');
  });

  it('Random Handle', () => {
    const randomHandle = Shapes.Factory.createHandle({
      kind: 'random',
      parent: parentNode,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(randomHandle);
    expect(component.placement).toEqual('top');
    expect(component.tooltipText).toBeUndefined();
  });

});
