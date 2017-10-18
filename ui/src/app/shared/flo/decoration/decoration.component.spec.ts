import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../../../streams/flo/render.service';
import { MockMetamodelService } from '../../../streams/flo/mocks/mock-metamodel.service';
import { DecorationComponent } from './decoration.component';
import { Constants } from 'spring-flo';

import * as _joint from 'jointjs';
const joint: any = _joint;

function createMockView(cell: dia.Element): any {
  return {
    model: cell,
  };
}

describe('DecorationComponent Tests.', () => {

  const MOCK_METAMODEL_SERVICE = new MockMetamodelService();
  const RENDER_SERVICE = new RenderService(MOCK_METAMODEL_SERVICE);

  let graph: dia.Graph;
  let component: DecorationComponent;
  let parentNode: dia.Element;

  beforeEach(() => {
    graph = new joint.dia.Graph();
    component = new DecorationComponent();
    parentNode = Shapes.Factory.createNode({
      metadata: MOCK_METAMODEL_SERVICE.data.get('source').get('http'),
      renderer: RENDER_SERVICE,
      graph: graph
    });
  });

  it('No decoration view', () => {
    expect(component.kind).toEqual('');
    expect(component.getMessages()).toEqual([]);
  });

  it('Error Marker', () => {
    const errorMarker = Shapes.Factory.createDecoration({
      kind: Constants.ERROR_DECORATION_KIND,
      messages: [
        'm1', 'm2', 'm3'
      ],
      parent: parentNode,
      renderer: RENDER_SERVICE,
      graph: graph
    });
    component.view = createMockView(errorMarker);
    expect(component.kind).toEqual(Constants.ERROR_DECORATION_KIND);
    expect(component.getMessages()).toEqual(['m1', 'm2', 'm3']);
  });

});
