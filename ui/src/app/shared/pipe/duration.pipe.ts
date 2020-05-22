import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  private DEFAULT = 'hh:mm:ss.SSS';
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
