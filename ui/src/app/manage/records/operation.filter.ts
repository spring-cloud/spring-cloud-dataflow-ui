import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { App } from '../../shared/model/app.model';
import { RecordService } from '../../shared/api/record.service';
import { RecordOperationType } from '../../shared/model/record.model';

@Component({
  selector: 'app-clr-datagrid-operation-filter',
  template: `
    <div>
      <clr-radio-wrapper>
        <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="all" name="options"/>
        <label>All operations</label>
      </clr-radio-wrapper>
      <clr-radio-wrapper *ngFor="let operation of operationTypes">
        <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="{{operation.key}}" name="options"/>
        <label>{{operation.name}}</label>
      </clr-radio-wrapper>
    </div>`,
})
export class OperationFilterComponent implements OnInit {

  private pchanges = new Subject<any>();
  property = 'operationType';
  @Input() value = null;
  val = 'all';
  operationTypes: RecordOperationType[];

  constructor(private recordService: RecordService) {
  }

  ngOnInit(): void {
    this.recordService.getOperationTypes()
      .subscribe((operationTypes) => {
        this.operationTypes = operationTypes;
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
      this.value = (this.val as any) as RecordOperationType;
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
