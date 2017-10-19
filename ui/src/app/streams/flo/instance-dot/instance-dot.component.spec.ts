import { InstanceDotComponent } from './instance-dot.component';
import '../support/shapes';
import { InstanceMetrics, TYPE, INPUT_CHANNEL_MEAN, OUTPUT_CHANNEL_MEAN } from '../../model/stream-metrics';

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
    expect(component.isSource).toBeFalsy();
    expect(component.isSink).toBeFalsy();
    expect(component.guid).toEqual('');
    expect(component.inputMean).toBeUndefined();
    expect(component.outputMean).toBeUndefined();
  });

  it('source input', () => {
    const properties = {};
    properties[TYPE] = 'source';
    component.view = createView(new InstanceMetrics().deserialize({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      metrics: [
        {name: INPUT_CHANNEL_MEAN, value: 5},
        {name: OUTPUT_CHANNEL_MEAN, value: 3.33433}
      ]
    }));

    expect(component.instance).toBeDefined();
    expect(component.isSource).toBeTruthy();
    expect(component.isSink).toBeFalsy();
    expect(component.guid).toEqual('my-guid');
    expect(component.inputMean).toBeUndefined();
    expect(component.outputMean).toEqual('3.334');
  });

  it('sink input', () => {
    const properties = {};
    properties[TYPE] = 'sink';
    component.view = createView(new InstanceMetrics().deserialize({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      metrics: [
        {name: INPUT_CHANNEL_MEAN, value: 5.6758398},
        {name: OUTPUT_CHANNEL_MEAN, value: 3.33433211}
      ]
    }));

    expect(component.instance).toBeDefined();
    expect(component.isSource).toBeFalsy();
    expect(component.isSink).toBeTruthy();
    expect(component.guid).toEqual('my-guid');
    expect(component.inputMean).toEqual('5.676');
    expect(component.outputMean).toBeUndefined();
  });

  it('processor input', () => {
    const properties = {};
    properties[TYPE] = 'processor';
    component.view = createView(new InstanceMetrics().deserialize({
      guid: 'my-guid',
      index: 0,
      properties: properties,
      metrics: [
        {name: INPUT_CHANNEL_MEAN, value: 5.6758398},
        {name: OUTPUT_CHANNEL_MEAN, value: 3.33433211}
      ]
    }));

    expect(component.instance).toBeDefined();
    expect(component.isSource).toBeFalsy();
    expect(component.isSink).toBeFalsy();
    expect(component.guid).toEqual('my-guid');
    expect(component.inputMean).toEqual('5.676');
    expect(component.outputMean).toEqual('3.334');
  });

  function createView(instance: InstanceMetrics): any {
    return {
      model: new joint.shapes.flo.InstanceDot({
        attrs: {
          instance: instance
        }
      })
    };

  }

});
