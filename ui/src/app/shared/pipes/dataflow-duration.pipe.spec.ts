import { DataflowDurationPipe } from './dataflow-duration.pipe';
import { DateTime } from 'luxon';

describe('DataflowDurationPipe', () => {

  let pipe: DataflowDurationPipe;

  beforeEach(() => {
    pipe = new DataflowDurationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('convert millis', () => {
    expect(pipe.transform(
      DateTime.fromISO('2017-08-11T06:15:49.578Z'),
      DateTime.fromISO('2017-08-11T06:15:50.145Z')))
      .toEqual('00:00:00.567');
  });

  it('convert null', () => {
    expect(pipe.transform(null, null)).toEqual('N/A');
    expect(pipe.transform(DateTime.local(), null)).toEqual('N/A');
    expect(pipe.transform(null, DateTime.local())).toEqual('N/A');
  });
});
