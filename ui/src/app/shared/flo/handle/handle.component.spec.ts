import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../../../streams/components/flo/render.service';
import { HandleComponent } from './handle.component';
import { Constants } from 'spring-flo';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { MetamodelService } from '../../../streams/components/flo/metamodel.service';
import { async } from '@angular/core/testing';

import * as _joint from 'jointjs';
const joint: any = _joint;

function createMockView(cell: dia.Element): any {
  return {
    model: cell,
  };
}

describe('HandleComponent Tests.', () => {

  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());
  const RENDER_SERVICE = new RenderService(METAMODEL_SERVICE);

  let graph: dia.Graph;
  let component: HandleComponent;
  let parentNode: dia.Element;

  beforeEach(async(() => {
    METAMODEL_SERVICE.load().then(metamodel => {
      graph = new joint.dia.Graph();
      component = new HandleComponent();
      parentNode = Shapes.Factory.createNode({
        metadata: metamodel.get('source').get('http'),
        renderer: RENDER_SERVICE,
        graph: graph
      });
    });
  }));

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
