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
