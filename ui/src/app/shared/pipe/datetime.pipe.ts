import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: string | DateTime, format: string = null): string {
    let m: DateTime;
    if (value instanceof DateTime) {
      m = value;
    } else {
      m = DateTime.fromISO(value as string);
    }
    if (m.isValid) {
      return m.toFormat(format != null ? format : 'yyyy-MM-dd HH:mm:ss,SSS[Z]');
    } else {
      return 'N/A';
    }
  }
}
