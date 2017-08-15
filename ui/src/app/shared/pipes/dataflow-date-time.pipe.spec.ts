import { DataflowDateTimePipe } from './dataflow-date-time.pipe';
import * as moment from 'moment';

describe('DataflowDateTimePipe', () => {

  let pipe: DataflowDateTimePipe;

  beforeEach(() => {
    pipe = new DataflowDateTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('convert string', () => {
    const expected = moment('1970').format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    expect(pipe.transform('1970')).toEqual(expected);
  });

  it('convert string with format argument', () => {
    expect(pipe.transform('1971-01-01', 'Y')).toEqual('1971');
  });

  it('convert number', () => {
    const expected = moment(0).format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    expect(pipe.transform(0)).toEqual(expected);
  });

  it('convert moment', () => {
    const datetime = moment(0);
    const expected = moment(datetime).format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    expect(pipe.transform(datetime)).toEqual(expected);
  });

  it('convert moment null passed', () => {
    const datetime = moment(null);
    expect(pipe.transform(datetime)).toEqual('N/A');
  });
});
