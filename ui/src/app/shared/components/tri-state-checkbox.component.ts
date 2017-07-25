import { Component, Input, AfterViewInit, DoCheck,
         ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Selectable } from '../../shared/model/selectable';

/**
 * Component to be primarily used in multi-select data-grids. The component will
 * render a checkbox that keeps in synch dynamically with the underlying data-model:
 *
 * - All elements are selected
 * - Some elements are selected
 * - None of the elements are selected
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-tri-state-checkbox',
  template: `<input #theCheckbox type="checkbox" [(ngModel)]="topLevel"
    (change)="topLevelChange()" [disabled]="!_items || _items.length==0">`
})
export class TriStateCheckboxComponent implements AfterViewInit, DoCheck  {

  public topLevel = false;
  public _items: Array<Selectable>;

  private _subscription: Subscription;
  @Input() items: Observable<any[]>;
  @ViewChild('theCheckbox') checkbox;

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  private setState() {
    if (!this._items) {
      return;
    }
    let count = 0;
    for (let i = 0; i < this._items.length; i++) {
      count += this._items[i].isSelected ? 1 : 0;
    }
    this.topLevel = (count === 0) ? false : true;
    if (count > 0 && count < this._items.length) {
      this.checkbox.nativeElement.indeterminate = true;
    } else {
      this.checkbox.nativeElement.indeterminate = false;
    }
  }

  ngDoCheck() {
    this.setState();
  }

  public topLevelChange() {
    for (let i = 0; i < this._items.length; i++) {
      this._items[i].isSelected = this.topLevel;
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.items);
    this._subscription = this.items.subscribe(res => {
      this._items = res;
      this.setState();
      this._changeDetectorRef.detectChanges();
    });
  }
}
