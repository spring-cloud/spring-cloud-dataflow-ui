import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

/**
 * Pipe that format a duration based on end and start times.
 *
 * @author Janne Valkealahti
 */
@Pipe({
  name: 'dataflowDuration'
})
export class DataflowDurationPipe implements PipeTransform {

  private DEFAULT = 'hh:mm:ss.SSS';

  /**
   * Returns a string containing the difference in time between the start and end parameters.
   * @param {DateTime} start The DateTime containing the start time.
   * @param {DateTime} end The DateTime containing the end time.
   * @param {string} format optional parameter dictating the style that the time difference should be shown.  If null
   * the default will be used.
   * @returns {string} string containing the difference between the start and end time in the format specified.  If
   * the result is not valid as identified by DateTime then 'N/A' is returned.
   */
  transform(start: DateTime, end: DateTime, format: string = null): string {
    if (start && end) {
      const m = end.diff(start);
      if (m.isValid) {
        return m.toFormat(format != null ? format : this.DEFAULT);
      }
    }
    return 'N/A';
  }
}
