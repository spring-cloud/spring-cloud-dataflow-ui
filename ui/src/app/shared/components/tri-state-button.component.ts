import {Component,Input,Output,OnInit, AfterViewInit, DoCheck,
  ViewChild,EventEmitter,ChangeDetectionStrategy,
  ChangeDetectorRef, Renderer, ElementRef,
  forwardRef} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';

import { Selectable } from '../../shared/model/selectable';

@Component({
  selector: 'scdf-tri-state-button',
  template:
  `<button #theButton name="topLevel" type="button" (click)="onClick()"
         class="btn btn-default"><span class="glyphicon glyphicon-trash"></span>
    {{label}}
  </button>`
})
export class TriStateButtonComponent implements AfterViewInit, DoCheck  {

  public topLevel: boolean = false;
  public _items: Array<Selectable> = [];

  private _subscription: Subscription;
  @Input()
  items: Observable<any[]>;

  @Output() eventHandler = new EventEmitter();

  label:String = '';

  @ViewChild("theButton") button;

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  public onClick() {
    this.eventHandler.emit();
  }

  private setState() {
    if (!this._items) {
      this.button.nativeElement.disabled = true;
      this.label = 'No app selected to unregister';
      return;
    }
    let count: number = 0;
    for (let i: number = 0; i < this._items.length; i++) {
      count += this._items[i].isSelected ? 1 : 0;
    }
    this.topLevel = (count === 0) ? false : true;

    let appOrApps = count > 1 ? 'apps' : 'app';

    if (count > 0 && count < this._items.length) {
      this.label = `Unregister ${count} Selected ${appOrApps}`;
      this.button.nativeElement.disabled = false;
    }
    else if (count === 0) {
      this.label = 'No app selected to unregister';
      this.button.nativeElement.disabled = true;
    }
    else {
      this.label = `Unregister all ${this._items.length} selected ${appOrApps}`;
      this.button.nativeElement.indeterminate = false;
    }
  }

  ngDoCheck() {
    this.setState();
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
