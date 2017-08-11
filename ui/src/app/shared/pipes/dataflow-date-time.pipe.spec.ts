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
    expect(pipe.transform('1970')).toEqual('1970-01-01T00:00:00.000Z');
  });

  it('convert string with format argument', () => {
    expect(pipe.transform('1971-01-01', 'Y')).toEqual('1971');
  });

  it('convert number', () => {
    expect(pipe.transform(0)).toEqual('1970-01-01T00:00:00.000Z');
  });

  it('convert moment', () => {
    const datetime = moment(0);
    expect(pipe.transform(datetime)).toEqual('1970-01-01T00:00:00.000Z');
  });

  it('convert moment null passed', () => {
    const datetime = moment(null);
    expect(pipe.transform(datetime)).toEqual('N/A');
  });
});
