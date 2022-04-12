import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {App, ApplicationType} from '../../shared/model/app.model';
import {RecordService} from '../../shared/api/record.service';
import {RecordActionType} from '../../shared/model/record.model';
import {NotificationService} from 'src/app/shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-clr-datagrid-action-filter',
  template: ` <div>
    <clr-radio-wrapper>
      <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="all" name="options" />
      <label>{{ 'auditRecords.allActions' | translate }}</label>
    </clr-radio-wrapper>

    <clr-radio-wrapper *ngFor="let action of actionTypes">
      <input type="radio" clrRadio (change)="change()" [(ngModel)]="val" value="{{ action.key }}" name="options" />
      <label>{{ action.name }}</label>
    </clr-radio-wrapper>
  </div>`
})
export class ActionFilterComponent implements OnInit {
  private pchanges = new Subject<any>();
  property = 'actionType';
  @Input() value = null;
  val = 'all';
  actionTypes: RecordActionType[];

  constructor(
    private recordService: RecordService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.recordService.getActionTypes().subscribe((actionTypes: RecordActionType[]) => {
      this.actionTypes = actionTypes;
      if (this.value === 'all' || this.value === '' || !this.value) {
        this.value = null;
      } else {
        this.val = this.value;
        this.pchanges.next(true);
      }
    },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      });
  }

  public get changes(): Observable<any> {
    return this.pchanges.asObservable();
  }

  change(): void {
    if (this.val === 'all') {
      this.value = null;
    } else {
      this.value = this.val as any as RecordActionType;
    }
    this.pchanges.next(true);
  }

  accepts(application: App): boolean {
    return true;
  }

  isActive(): boolean {
    return this.value !== null && this.value !== 'all' && this.value !== '';
  }
}
