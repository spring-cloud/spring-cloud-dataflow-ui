import { Component } from '@angular/core';

/**
 * Application actions
 */
@Component({
  selector: 'app-page-actions',
  template: `
    <div class="dataflow-page-actions">
      <ng-content></ng-content>
    </div>`
})
export class PageActionsComponent {

}
