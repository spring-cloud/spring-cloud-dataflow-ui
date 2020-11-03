import { ChangeDetectorRef, Component } from '@angular/core';
import { RecordService } from '../../shared/api/record.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { RecordPage } from '../../shared/model/record.model';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-records-list',
  templateUrl: './records.component.html',
})
export class RecordsComponent extends DatagridComponent {
  page: RecordPage;

  constructor(private recordService: RecordService,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected contextService: ContextService) {
    super(contextService, settingsService, changeDetectorRef, 'manage/records');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { actionType: '', operationType: '', dates: [null, null] });
      this.unsubscribe$ = this.recordService.getRecords(params.current - 1, params.size, params.search || '', params.actionType || '',
        params.operationType, params.dates[0], params.dates[1], `${params?.by || ''}`, `${params?.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: RecordPage) => {
          this.page = page;
          this.updateGroupContext(params);
          this.loading = false;
        });
    }
  }
}
