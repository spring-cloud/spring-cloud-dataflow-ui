import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Page } from '../../model/page';

/**
 * List Pagination
 * Display the pagination and the pager
 */
@Component({
  selector: 'app-list-pagination',
  template: `<div class="list-pagination" *ngIf="page && params && page.totalElements > 0">
    <div class="list-pagination-wrap">
      <div id="pagination" class="app-pagination"
           *ngIf="page.totalPages > 1 && page.items.length > 0">
        <pagination-controls (pageChange)="changePage($event)"></pagination-controls>
      </div>
      <app-pager [item]="item" [items]="items" [page]="params.page" [total]="page.totalElements" [size]="params.size"
                 (sizeChange)="changeSize($event)">
      </app-pager>
    </div>
  </div>`
})
export class ListPaginationComponent {

  @Input() page: Page<any>;

  @Input() params: any;

  @Output() changed = new EventEmitter();

  @Input() item = 'item';

  @Input() items = 'items';

  changePage(page: number) {
    const obj = Object.assign({}, this.params);
    obj.page = page - 1;
    this.changed.emit(obj);
  }

  changeSize(size: number) {
    const obj = Object.assign({}, this.params);
    obj.size = size;
    this.changed.emit(obj);
  }

}
