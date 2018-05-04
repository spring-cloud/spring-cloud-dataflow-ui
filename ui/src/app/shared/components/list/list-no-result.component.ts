import { Component, Input } from '@angular/core';
import { Page } from '../../model/page';

/**
 * List No Result
 */
@Component({
  selector: 'app-list-no-result',
  template: `
    <div id="no-result" *ngIf="page && filters && isEmpty()" class="dataflow-alert">
      <ng-content></ng-content>
    </div>`
})
export class ListNoResultComponent {

  /**
   * Page
   */
  @Input() page: Page<any>;

  /**
   * Filters
   */
  @Input() filters: Array<string>;

  /**
   * Determine if there is no application
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2) {
      return this.page.items.length === 0 && this.filters
        .map((filter) => (filter !== '' && filter))
        .filter((filter) => !!filter).length > 0;
    }
    return false;
  }

}
