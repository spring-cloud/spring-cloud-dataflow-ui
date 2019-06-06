import { Component, Input, AfterViewInit, DoCheck, ViewChild, Output, EventEmitter } from '@angular/core';

/**
 * Component to be primarily used in multi-select data-grids. The component will
 * render a checkbox
 *
 * - All elements are selected
 * - Some elements are selected
 * - None of the elements are selected
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-master-checkbox',
  template: `<input #ck type="checkbox" [(ngModel)]="input" (change)="click()" [disabled]="!items || items.length==0">`
})
export class MasterCheckboxComponent implements DoCheck, AfterViewInit {

  @ViewChild('ck', { static: true }) checkbox;

  @Input() items: Array<boolean>;

  @Output() change: EventEmitter<{}> = new EventEmitter();

  input: boolean;

  constructor() {
  }

  ngDoCheck() {
    this.update();
  }

  ngAfterViewInit() {
    this.update();
  }

  update() {
    if (!this.items) {
      return;
    }
    const count = this.items.reduce((a, b) => b ? a + 1 : a, 0);
    const indeterminate = (count > 0 && count < this.items.length);
    if ((count > 0) === this.input && this.checkbox.nativeElement.indeterminate === indeterminate) {
      return;
    }

    this.input = (count > 0);
    this.checkbox.nativeElement.indeterminate = indeterminate;
    this.change.emit({value: (count > 0), indeterminate: indeterminate});
  }

  click() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i] = this.input;
    }
  }

}
