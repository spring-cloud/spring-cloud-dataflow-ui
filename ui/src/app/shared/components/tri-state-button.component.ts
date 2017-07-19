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
  `<button #theButton name="topLevel" type="button"
         class="btn btn-default"><span class="glyphicon glyphicon-trash"></span>
    {{label}}
  </button>`
})
export class TristateButton implements AfterViewInit, DoCheck, OnInit  {

  public topLevel: boolean = false;
  public _items: Array<Selectable> = [];

  private _subscription: Subscription;
  @Input()
  items: Observable<any[]>;

  label:String = '';

  @ViewChild("theButton") button;

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  private setState() {
    if (!this._items) {
      this.button.nativeElement.disabled = true;
      this.label = 'No app selected to unregister';
      return;
    }
    let count: number = 0;
    for (var i: number = 0; i < this._items.length; i++) {
      count += this._items[i].isSelected ? 1 : 0;
    }
    this.topLevel = (count === 0) ? false : true;
    if (count > 0 && count< i) {
      console.log("Setting button to enabled.");
      this.label = `Unregister ${count} Selected App(s)`;
      this.button.nativeElement.disabled = false;
    }
    else if (count === 0) {
      console.log("Disabling button.");
      this.label = 'No app selected to unregister';
      this.button.nativeElement.disabled = true;
    }
    else {
      console.log("Button enabled.");
      this.label = `Unregister all ${this._items.length} selected apps`;
      this.button.nativeElement.indeterminate = false;
    }
  }

  ngDoCheck() {
    this.setState();
  }

  public topLevelChange() {
    console.log("Clicked. " + this.topLevel);
    for (var i: number = 0; i < this._items.length; i++) {
      this._items[i].isSelected = this.topLevel;
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.items);
    this._subscription = this.items.subscribe(res => {
      this._items = res;
      this.setState();
      this._changeDetectorRef.detectChanges();
    });
  }
}
