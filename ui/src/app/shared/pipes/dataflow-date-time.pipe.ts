import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { DateTimeUtils } from '../support/date-time.utils';

/**
 * Pipe that formats a given value into a datetime string
 * with optional format parameter defaulting to
 * 'Y-MM-DD HH:mm:ss,SSS Z' (DateTimeUtils.DEFAULT).
 *
 * @author Janne Valkealahti
 */
@Pipe({
  name: 'dataflowDateTime'
})
export class DataflowDateTimePipe implements PipeTransform {

  transform(value: string | DateTime, format: string = null): string {
    let m: DateTime;
    if (value instanceof DateTime) {
      m = value;
    } else {
      m = DateTime.fromISO(value as string);
    }
    if (m.isValid) {
      return m.toFormat(format != null ? format : DateTimeUtils.DEFAULT);
    } else {
      return 'N/A';
    }
  }
}
