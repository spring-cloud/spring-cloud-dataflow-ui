import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

/**
 * Pipe that format a duration based on end and start times.
 *
 * @author Janne Valkealahti
 */
@Pipe({
  name: 'dataflowDuration'
})
export class DataflowDurationPipe implements PipeTransform {

  private DEFAULT = 'HH:mm:ss.SSS';

  /**
   * Returns a string containing the difference in time between the start and end parameters.
   * @param {moment.Moment} start The moment containing the start time.
   * @param {moment.Moment} end The moment containing the end time.
   * @param {string} format optional parameter dictating the style that the time difference should be shown.  If null
   * the default will be used.
   * @returns {string} string containing the difference between the start and end time in the format specified.  If
   * the result is not valid as identified by moment then 'N/A' is returned.
   */
  transform(start: Moment, end: Moment, format: string = null): string {
    // wrap end with moment to prevent null errors
    const m = moment.utc(moment(end).diff(start));
    if (m.isValid()) {
      return m.format(format != null ? format : this.DEFAULT);
    } else {
      return 'N/A';
    }
  }
}
