import { Component, Input, AfterViewInit, DoCheck, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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

  /**
   * The state of the tri-state button.  True selected, false unselected.
   * @type {boolean}
   */
  public topLevel = false;

  /**
   * The array that is used to determine the state of the button.
   * @type {Array}
   */
  public _items: Array<Selectable>;

  /**
   * The subscription to the item observable.
   */
  private _subscription: Subscription;

  /**
   * Observable on a list that populates the _items list that is used to determine button state.
   */
  @Input() items: Observable<any[]>;

  @ViewChild('theCheckbox') checkbox;

  constructor() { }


  /**
   * Establishes the state of the checkbox.
   */
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

  /**
   * Updates the checkbox state when the monitored array is dirty.
   */
  ngDoCheck() {
    this.getItems();
  }

  /**
   * Sets the state of the child check boxes in the array to the same state as the triState.
   */
  public topLevelChange() {
    for (let i = 0; i < this._items.length; i++) {
      this._items[i].isSelected = this.topLevel;
    }
  }

  /**
   * Initializes the state of the tri-state checkbox after component is initialized.
   */
  ngAfterViewInit() {
    this.getItems();
  }

  /**
   * Subscribes the items observable to obtain an array of items.
   */
  private getItems() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._subscription = this.items.subscribe(
      res => {
        this._items = res;
      },
      error => {
        console.log('error', error);
        this.setState();
      },
      () => {
        this.setState();
      });
  }
}
