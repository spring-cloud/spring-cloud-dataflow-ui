import {ChangeDetectorRef, Component} from '@angular/core';
import {RecordService} from '../../shared/api/record.service';
import {ClrDatagridStateInterface} from '@clr/angular';
import {RecordPage} from '../../shared/model/record.model';
import {DatagridComponent} from '../../shared/component/datagrid/datagrid.component';
import {ContextService} from '../../shared/service/context.service';
import {SettingsService} from '../../settings/settings.service';
import {NotificationService} from '../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-records-list',
  templateUrl: './records.component.html'
})
export class RecordsComponent extends DatagridComponent {
  page: RecordPage;

  constructor(
    private recordService: RecordService,
    protected settingsService: SettingsService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected contextService: ContextService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    super(contextService, settingsService, changeDetectorRef, 'manage/records');
  }

  refresh(state: ClrDatagridStateInterface): void {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, {actionType: '', operationType: '', dates: [null, null]});
      this.unsubscribe$ = this.recordService
        .getRecords(
          params.current - 1,
          params.size,
          params.search || '',
          params.actionType || '',
          params.operationType,
          params.dates[0],
          params.dates[1],
          `${params?.by || ''}`,
          `${params?.reverse ? 'DESC' : 'ASC'}`
        )
        .subscribe(
          (page: RecordPage) => {
            this.page = page;
            this.updateGroupContext(params);
            this.loading = false;
          },
          error => {
            this.notificationService.error(this.translate.instant('commons.message.error'), error);
            this.loading = false;
          }
        );
    }
  }
}
