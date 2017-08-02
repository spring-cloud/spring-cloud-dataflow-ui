import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keyvalues'})
export class KeyValuePipe implements PipeTransform {
    transform(map, args: Object[]): any {
        const keys = [];
        for (const key of Object.keys(map)) {
            keys.push({key: key, value: map[key]});
        }
        return keys;
    }
}
