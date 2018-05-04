import { Component, Input } from '@angular/core';
import { RoutingStateService } from '../../services/routing-state.service';

/**
 * Application Head Back Action
 */
@Component({
  selector: 'app-page-head-back',
  template: `<a (click)="click()"><span class="fa fa-chevron-left"></span></a>`
})
export class PageHeadBackComponent {

  @Input() defaultUrl: string;

  @Input() isNotRegex: string;

  constructor(private routingStateService: RoutingStateService) {

  }

  click() {
    if (this.defaultUrl) {
      const regex = this.isNotRegex ? new RegExp(this.isNotRegex) : null;
      this.routingStateService.back(this.defaultUrl, regex);
    }
  }

}
