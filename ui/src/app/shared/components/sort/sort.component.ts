import { Component, Output, EventEmitter, Input } from '@angular/core';
import { OrderParams, SortParams } from '../shared.interface';

/**
 * Sort
 *
 * Display a clickable link displayed with an icon if the sort is apply on it.
 * Sort: the global sort
 * Value: the value of the component
 * Change: emit an event if the component ask to change the sort
 * Indeterminate: if true, a empty sort can be emit
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-sort',
  styleUrls: ['./styles.scss'],
  template: `
    <a (click)="click()">
      <ng-content></ng-content>
      <span *ngIf="sort?.sort == value" class="ico">
        <span *ngIf="sort?.order == 'DESC'" class="sort-ico desc"></span>
        <span *ngIf="sort?.order == 'ASC'" class="sort-ico asc"></span>
      </span>
    </a>
  `
})
export class SortComponent {

  @Input() sort: SortParams;

  @Input() value: string;

  @Output() change: EventEmitter<SortParams> = new EventEmitter();

  @Input() indeterminate: boolean;

  constructor() {
  }

  click() {
    let order = OrderParams.ASC;
    if (this.sort.sort === this.value) {
      if (this.sort.order === OrderParams.ASC) {
        order = OrderParams.DESC;
      } else {
        if (this.sort.order === OrderParams.DESC && this.indeterminate) {
          this.change.emit({sort: '', order: ''});
          return;
        }
      }
    }
    this.change.emit({sort: this.value, order: order});
  }

}
