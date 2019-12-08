import { Shapes } from 'spring-flo';
import { dia } from 'jointjs';
import { RenderService } from '../../../streams/components/flo/render.service';
import { DecorationComponent } from './decoration.component';
import { Constants } from 'spring-flo';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { MetamodelService } from '../../../streams/components/flo/metamodel.service';
import { async } from '@angular/core/testing';

import * as _joint from 'jointjs';
import {NodeHelper} from "../../../streams/components/flo/support/node-helper";

const joint: any = _joint;

function createMockView(cell: dia.Element): any {
  return {
    model: cell,
  };
}

class MockDocService {
  mouseDown = false;
  isMouseDown = () => this.mouseDown;
}

class CutomRenderService extends RenderService {

  createDecoration(kind: string, parent: dia.Cell) {
    return NodeHelper.createDecoration(kind, parent);
  }
}


describe('DecorationComponent Tests.', () => {

  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService());
  const RENDER_SERVICE = new CutomRenderService(METAMODEL_SERVICE);
  const DOC_SERVICE = new MockDocService();

  let graph: dia.Graph;
  let component: DecorationComponent;
  let parentNode: dia.Element;

  beforeEach(async(() => {
    METAMODEL_SERVICE.load().then(metamodel => {
      graph = new joint.dia.Graph();
      component = new DecorationComponent(<any>DOC_SERVICE);
      parentNode = Shapes.Factory.createNode({
        metadata: metamodel.get('source').get('http'),
        renderer: RENDER_SERVICE,
        graph: graph
      });
    });
  }));

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
