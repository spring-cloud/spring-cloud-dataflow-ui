import { Component } from '@angular/core';

/**
 * Application Page Head
 */
@Component({
  selector: 'app-page-head',
  template: `
    <div class="dataflow-page-head">
      <ng-content></ng-content>
    </div>`
})
export class PageHeadComponent {

}
