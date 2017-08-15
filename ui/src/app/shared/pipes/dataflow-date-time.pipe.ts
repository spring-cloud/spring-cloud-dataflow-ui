import { Pipe, PipeTransform } from '@angular/core';
import { isMoment, Moment } from 'moment';
import * as moment from 'moment';

/**
 * Pipe that formats a given value into a datetime string
 * with optional format parameter defaulting to
 * 'Y-MM-DD HH:mm:ss,SSS Z'.
 *
 * @author Janne Valkealahti
 */
@Pipe({
  name: 'dataflowDateTime'
})
export class DataflowDateTimePipe implements PipeTransform {

  private DEFAULT = 'Y-MM-DD[T]HH:mm:ss.SSS[Z]';

  transform(value: number|string|Moment, format: string = null): string {
    let m: Moment;
    if (isMoment(value)) {
      m = value;
    } else {
      m = moment(value);
    }
    if (m.isValid()) {
      return m.format(format != null ? format : this.DEFAULT);
    } else {
      return 'N/A';
    }
  }
}
