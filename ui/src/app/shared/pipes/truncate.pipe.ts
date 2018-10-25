import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that truncate a string.
 *
 * Use a pipe :
 * 'abcdef' | tuncate: 4
 *    abcd…
 * 'abcdef' | tuncate: -4: ' (…)'
 *    (…) cdef
 *
 * @author Damien Vitrac
 */
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: number | string, size: number = 40, trail: String = '…'): string {
    value = value.toString();
    if (value.length <= Math.abs(size)) {
      return value;
    }
    if (size < 0) {
      return trail + value.substr(value.length - Math.abs(size), Math.abs(size));
    }
    return value.substr(0, size) + trail;
  }

}
