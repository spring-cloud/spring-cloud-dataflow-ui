import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keyvalues'})
export class KeyValuePipe implements PipeTransform {
    transform(map, args:Object[]) : any {
        let keys = [];
        for (let key in map) {
            keys.push({key: key, value: map[key]});
        }
        return keys;
    }
}
