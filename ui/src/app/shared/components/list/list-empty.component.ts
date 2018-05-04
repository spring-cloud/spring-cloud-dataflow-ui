import { Component, Input } from '@angular/core';
import { Page } from '../../model/page';

/**
 * App List Empty
 * Display the content if the list is empty
 */
@Component({
  selector: 'app-list-empty',
  template: `
    <div id="empty" *ngIf="page && filters && isEmpty()" class="dataflow-alert">
      <ng-content></ng-content>
    </div>`
})
export class ListEmptyComponent {

  /**
   * Page
   */
  @Input() page: Page<any>;

  /**
   * Filters query
   */
  @Input() filters: Array<string>;

  /**
   * Determine if there is no application
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2) {
      return this.page.items.length === 0 && this.filters
        .map((filter) => (filter === '' || !filter))
        .filter((filter) => !!filter).length === this.filters.length;
    }
    return false;
  }

}
