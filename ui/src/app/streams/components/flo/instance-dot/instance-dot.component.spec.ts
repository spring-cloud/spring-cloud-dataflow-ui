import { InstanceDotComponent } from './instance-dot.component';
import '../support/shapes';
import { InstanceStatus, TYPE } from '../../../model/stream-metrics';

import * as _joint from 'jointjs';

const joint: any = _joint;

/**
 * Test {@link GraphViewComponent}.
 *
 * @author Alex Boyko
 */
describe('InstanceDotComponent', () => {
  let component: InstanceDotComponent;

  beforeEach(() => {
    component = new InstanceDotComponent();
  });

  it('no input', () => {
    expect(component).toBeTruthy();
    expect(component.instance).toBeUndefined();
    expect(component.guid).toEqual('');
    expect(component.state).toEqual('');
  });

  it('source input', () => {
    const properties = {};
    properties[TYPE] = 'source';
    component.view = createView(InstanceStatus.fromJSON({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      state: 'deployed'
    }));

    expect(component.instance).toBeDefined();
    expect(component.guid).toEqual('my-guid');
    expect(component.state).toEqual('deployed');
  });

  it('sink input', () => {
    const properties = {};
    properties[TYPE] = 'sink';
    component.view = createView(InstanceStatus.fromJSON({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      state: 'deployed'
    }));

    expect(component.instance).toBeDefined();
    expect(component.guid).toEqual('my-guid');
    expect(component.state).toEqual('deployed');
  });

  it('processor input', () => {
    const properties = {};
    properties[TYPE] = 'processor';
    component.view = createView(InstanceStatus.fromJSON({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      state: 'deployed'
    }));

    expect(component.instance).toBeDefined();
    expect(component.guid).toEqual('my-guid');
    expect(component.state).toEqual('deployed');
  });

  function createView(instance: InstanceStatus): any {
    return {
      model: new joint.shapes.flo.InstanceDot({
        attrs: {
          instance: instance
        }
      })
    };

  }

});
