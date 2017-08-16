import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which can be used to convert typescript Map
 * into key/value array.
 *
 * @author Janne Valkealahti
 */
@Pipe({
  name: 'mapValuesPipe'
})
export class MapValuesPipe implements PipeTransform {

  transform(value: Map<string, string>): any {
    const array = [];

    value.forEach((val, key) => {
      array.push({
        key: key,
        value: val
      });
    });
    return array;
  }
}
