import { Pipe, PipeTransform } from '@angular/core';
import { ClrDatagrid } from '@clr/angular';
import { take } from 'rxjs/operators';
import { ContextModel } from '../model/context.model';
import { ContextService } from '../service/context.service';

@Pipe({
  name: 'datagridcolumn'
})
export class DatagridColumnPipe implements PipeTransform {

  constructor(private contextService: ContextService) {
  }

  async transform(value, datagrid: ClrDatagrid, contextName: string, gap = 10) {
    if (value) {
      return +value;
    }
    const context = await this.contextService.getContext(contextName)
      .pipe(take(1)).toPromise();
    const cols = [];
    context.forEach((ct: ContextModel) => {
      if (ct.name !== 'size' && ct.name.startsWith('size') && +ct.value > 0) {
        cols.push(+ct.value);
      }
    });
    await setTimeout(() => {
    });
    const length = datagrid?.columns?.length - cols.length;
    const width = datagrid?.datagridTable?.nativeElement?.clientWidth - cols
      .reduce((prev, current) => prev + current, 0);

    if (!length || !width) {
      return;
    }
    return Math.max(Math.round(width / length - gap), 50);
  }

}
