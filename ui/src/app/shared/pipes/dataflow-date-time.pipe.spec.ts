import { DataflowDateTimePipe } from './dataflow-date-time.pipe';
import { DateTime } from 'luxon';

describe('DataflowDateTimePipe', () => {

  let pipe: DataflowDateTimePipe;

  beforeEach(() => {
    pipe = new DataflowDateTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('convert string', () => {
    const expected = DateTime.fromISO('1970').toFormat('yyyy-MM-dd HH:mm:ss,SSS[Z]');
    expect(pipe.transform('1970')).toEqual(expected);
  });

  it('convert string with format argument', () => {
    expect(pipe.transform('1971-01-01', 'yyyy')).toEqual('1971');
  });

  it('Invalid date', () => {
    expect(pipe.transform('0')).toEqual('N/A');
  });

  it('convert DateTime null passed', () => {
    const datetime = DateTime.fromISO(null);
    expect(pipe.transform(datetime)).toEqual('N/A');
  });
});
