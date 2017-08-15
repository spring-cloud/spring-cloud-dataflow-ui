import { DataflowDurationPipe } from './dataflow-duration.pipe';
import * as moment from 'moment';

describe('DataflowDurationPipe', () => {

  let pipe: DataflowDurationPipe;

  beforeEach(() => {
    pipe = new DataflowDurationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('convert millis', () => {
    expect(pipe.transform(moment(0), moment(1))).toEqual('00:00:00.001');
    expect(pipe.transform(
      moment('2017-08-11T06:15:49.578Z', 'Y-MM-DD[T]HH:mm:ss.SSS[Z]'),
      moment('2017-08-11T06:15:50.145Z', 'Y-MM-DD[T]HH:mm:ss.SSS[Z]')))
      .toEqual('00:00:00.567');
  });

  it('convert millis custom format', () => {
    expect(pipe.transform(moment(0), moment(1), 'HH:mm:ss,SSS [elapsed]')).toEqual('00:00:00,001 elapsed');
  });

  it('convert null', () => {
    expect(pipe.transform(moment(null), moment(1))).toEqual('N/A');
    expect(pipe.transform(moment(0), moment(null))).toEqual('N/A');
    expect(pipe.transform(moment(null), moment(null))).toEqual('N/A');
  });
});
