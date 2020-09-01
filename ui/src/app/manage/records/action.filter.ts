import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { App, ApplicationType } from '../../shared/model/app.model';
import { RecordService } from '../../shared/api/record.service';
import { RecordActionType } from '../../shared/model/record.model';

@Component({
  selector: 'app-clr-datagrid-action-filter',
  template: `
    <div>
      <clr-radio-wrapper>
        <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="all" name="options"/>
        <label>All actions</label>
      </clr-radio-wrapper>

      <clr-radio-wrapper *ngFor="let action of actionTypes">
        <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="{{action.key}}" name="options"/>
        <label>{{action.name}}</label>
      </clr-radio-wrapper>
    </div>`,
})
export class ActionFilterComponent implements OnInit {

  private pchanges = new Subject<any>();
  property = 'actionType';
  @Input() value = null;
  val = 'all';
  actionTypes: RecordActionType[];

  constructor(private recordService: RecordService) {
  }

  ngOnInit(): void {
    this.recordService.getActionTypes()
      .subscribe((actionTypes) => {
        this.actionTypes = actionTypes;
        if (this.value === 'all' || this.value === '' || !this.value) {
          this.value = null;
        } else {
          this.val = this.value;
          this.pchanges.next(true);
        }
      });
  }

  public get changes(): Observable<any> {
    return this.pchanges.asObservable();
  }

  change() {
    if (this.val === 'all') {
      this.value = null;
    } else {
      this.value = (this.val as any) as RecordActionType;
    }
    this.pchanges.next(true);
  }

  accepts(application: App) {
    return true;
  }

  isActive(): boolean {
    return this.value !== null && this.value !== 'all' && this.value !== '';
  }

}
