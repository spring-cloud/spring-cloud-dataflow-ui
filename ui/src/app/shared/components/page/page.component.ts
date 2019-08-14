import { Component } from '@angular/core';
import { PageHeadComponent } from './page-head.component';
import { PageHeadActionsComponent } from './page-head-actions.component';
import { PageHeadBackComponent } from './page-head-back.component';
import { PageHeadSubtitleComponent } from './page-head-subtitle.component';
import { PageHeadTitleComponent } from './page-head-title.component';
import { PageActionsComponent } from './page-actions.component';
import { TippyDirective } from '../../directives/tippy.directive';

/**
 * Application page
 */
@Component({
  selector: 'app-page',
  template: `
    <div class="dataflow-page">
      <ng-content></ng-content>
    </div>`
})
export class PageComponent {
}

/**
 * Export All Page Component
 */
export const DATAFLOW_PAGE = [
  PageComponent, PageHeadComponent, PageHeadActionsComponent, PageHeadBackComponent, PageHeadSubtitleComponent,
  PageHeadTitleComponent, PageActionsComponent
];
