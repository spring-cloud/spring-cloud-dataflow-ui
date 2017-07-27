import {
  Component, Input, Output, AfterViewInit, DoCheck, ViewChild, EventEmitter
} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import { Selectable } from '../../shared/model/selectable';

@Component({
  selector: 'app-tri-state-button',
  template:
  `<button #theButton name="topLevel" type="button" (click)="onClick()"
         class="btn btn-default"><span class="glyphicon glyphicon-trash"></span>
    {{label}}
  </button>`
})
export class TriStateButtonComponent implements AfterViewInit, DoCheck {

  public _items: Array<Selectable> = [];

  private _subscription: Subscription;

  @Input()
  items: Observable<any[]>;

  @Input()
  noneSelectedLabel: string;

  @Input()
  oneSelectedLabel: string;

  @Input()
  manySelectedLabel: string;

  @Input()
  allSelectedLabel: string;

  label = '';

  @Output() eventHandler = new EventEmitter();

  @ViewChild('theButton') button;

  constructor() { }

  public onClick() {
    this.eventHandler.emit();
  }

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
      count += this._items[i].isSelected ? 1 : 0;
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

  ngDoCheck() {
    this.getItems();
  }

  ngAfterViewInit() {
    this.getItems();
  }

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
