import {
  Component, Input, Output, AfterViewInit, DoCheck, ViewChild, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import { Selectable } from '../../shared/model/selectable';

/**
 * Component that supports a button that can change its message based on count of items in a array.
 * @author Gunnar Hillert
 * @author Janne Valkealahti
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-tri-state-button',
  template:
  `<button #theButton name="topLevel" type="button" (click)="onClick()"
         class="btn btn-default"><span class="glyphicon glyphicon-{{icon}}"></span>
    <span class="hidden-xs">{{label}}</span>
  </button>`
})
export class TriStateButtonComponent implements AfterViewInit, DoCheck {

  /**
   * The array that is used to determine the state of the button.
   * @type {Array}
   */
  public _items: Array<Selectable> = [];

  /**
   * The subscription to the item observable.
   */
  private _subscription: Subscription;

  /**
   * Observable on a list that populates the _items list that is used to determine button state.
   */
  @Input()
  items: Observable<any[]>;

  /**
   * The text to be displayed in the button if no items are selected.
   */
  @Input()
  noneSelectedLabel: string;

  /**
   * The text to be displayed in the button if one item is selected.
   */
  @Input()
  oneSelectedLabel: string;

  /**
   * The text to be displayed in the button if more than one, but not all items are selected.
   */
  @Input()
  manySelectedLabel: string;

  /**
   * The text to be displayed in the button if all items are selected.
   */
  @Input()
  allSelectedLabel: string;

  /**
   * The icon displayed inside the button
   * Trash by default
   * @type {string}
   */
  @Input()
  icon = 'trash';

  /**
   * Optional Function to filter items, should return a Boolean.
   * @type {Function}
   */
  @Input()
  filter: Function;

  /**
   * The button label.
   * @type {string}
   */
  label = '';

  /**
   * Emits event on button click.
   * @type {EventEmitter}
   */
  @Output() eventHandler = new EventEmitter();

  @ViewChild('theButton') button;

  constructor() { }

  /**
   * Emits an event when click action occurs.
   */
  public onClick() {
    this.eventHandler.emit();
  }

  /**
   * Establishes what will be displayed on the button as well as if the button is disabled or not.
   */
  private setState() {
    if (!this.button) {
      return;
    }
    if (!this._items) {
      this.button.nativeElement.disabled = true;
      return;
    }
    let count = 0;
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].isSelected) {
        count += this.filter ? this.filter(this._items[i]) : 1;
      }
    }

    if (count > 0 && count < this._items.length) {
      if (count > 1) {
        this.label = this.manySelectedLabel.replace('{selectedCount}', count + '');
      } else {
        this.label = this.oneSelectedLabel.replace('{selectedCount}', count + '');
      }
      this.button.nativeElement.disabled = false;
    } else if (count === 0) {
      this.label = this.noneSelectedLabel.replace('{selectedCount}', count + '');
      this.button.nativeElement.disabled = true;
    } else {
      this.label = this.allSelectedLabel.replace('{selectedCount}', count + '');
      this.button.nativeElement.disabled = false;
      this.button.nativeElement.indeterminate = false;
    }
  }

  /**
   * Updates the button state when the monitored array is dirty.
   */
  ngDoCheck() {
    this.getItems();
  }

  /**
   * Updates the button state after the component has been fully initialized.
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
