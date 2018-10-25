import { MessageRateComponent } from './message-rate.component';
import { TYPE_OUTGOING_MESSAGE_RATE, TYPE_INCOMING_MESSAGE_RATE } from '../support/shapes';
import * as _joint from 'jointjs';

const joint: any = _joint;

/**
 * Test {@link MessageRateComponent}.
 *
 * @author Alex Boyko
 */
describe('MessageRateComponent', () => {
  let component: MessageRateComponent;

  beforeEach(() => {
    component = new MessageRateComponent();
  });

  it('no input', () => {
    expect(component).toBeTruthy();
    expect(component.rate).toEqual(0);
    expect(component.rateLabel).toEqual('0.000');
    expect(component.rateTooltip).toEqual('0');
    expect(component.tooltipPlacement).toEqual('top');
    expect(component.cssClasses).toEqual([]);
  });

  it('simple rate', () => {
    component.data = createData(3);
    expect(component.rate).toEqual(3);
    expect(component.rateLabel).toEqual('3.00');
    expect(component.rateTooltip).toEqual('3');
    expect(component.tooltipPlacement).toEqual('top');
  });

  it('top placement', () => {
    component.data = createData(3, TYPE_OUTGOING_MESSAGE_RATE);
    expect(component.rate).toEqual(3);
    expect(component.tooltipPlacement).toEqual('top');
  });

  it('bottom placement', () => {
    component.data = createData(3, TYPE_INCOMING_MESSAGE_RATE);
    expect(component.rate).toEqual(3);
    expect(component.tooltipPlacement).toEqual('bottom');
  });

  it('cssClass', () => {
    component.data = createData(2, 'my-css-class');
    expect(component.cssClasses).toEqual([ 'my-css-class' ]);
  });

  it('cssClass in message rate', () => {
    component.data = createData(2, TYPE_OUTGOING_MESSAGE_RATE);
    expect(component.cssClasses).toEqual([ 'dataflow-outgoing-rate' ]);
  });

  it('K rate', () => {
    component.data = createData(38765);
    expect(component.rate).toEqual(38765);
    expect(component.rateLabel).toEqual('38.8K');
    expect(component.rateTooltip).toEqual('38765');
  });

  it('M rate', () => {
    component.data = createData(38765111);
    expect(component.rate).toEqual(38765111);
    expect(component.rateLabel).toEqual('38.8M');
    expect(component.rateTooltip).toEqual('38765111');
  });

  it('B rate', () => {
    component.data = createData(38765111222);
    expect(component.rate).toEqual(38765111222);
    expect(component.rateLabel).toEqual('38.8B');
    expect(component.rateTooltip).toEqual('38765111222');
  });

  it('very low rate', () => {
    component.data = createData(0.0000387651);
    expect(component.rate).toEqual(0.0000387651);
    expect(component.rateLabel).toEqual('0.000');
    expect(component.rateTooltip).toEqual('0.0000387651');
  });

  function createData(rate: number, type?: string): any {
    return {
      rate: rate,
      type: type
    };

  }

});
