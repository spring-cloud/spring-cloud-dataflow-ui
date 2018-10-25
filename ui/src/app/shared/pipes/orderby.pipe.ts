import { Pipe, PipeTransform } from '@angular/core';
import { OrderParams } from '../components/shared.interface';

@Pipe({
  name: 'orderby'
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, sort: string, order ?: string) {
    if (!array) {
      return;
    }
    if (!sort) {
      return array;
    }
    if (!order) {
      order = OrderParams.ASC;
    }
    return Object.assign([], array).sort((a: any, b: any) => {
      if (order === OrderParams.ASC) {
        return a[sort] > b[sort] ? 1 : -1;
      } else {
        return a[sort] <= b[sort] ? 1 : -1;
      }
    });
  }
}
