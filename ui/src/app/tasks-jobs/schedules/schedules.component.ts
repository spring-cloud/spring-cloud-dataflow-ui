import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ScheduleService} from '../../shared/api/schedule.service';
import {ClrDatagridStateInterface} from '@clr/angular';
import {Schedule, SchedulePage} from '../../shared/model/schedule.model';
import {DestroyComponent} from './destroy/destroy.component';
import {DatagridComponent} from '../../shared/component/datagrid/datagrid.component';
import {ContextService} from '../../shared/service/context.service';
import {SettingsService} from '../../settings/settings.service';
import {NotificationService} from '../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html'
})
export class SchedulesComponent extends DatagridComponent {
  page: SchedulePage;
  @ViewChild('destroyModal', {static: true}) destroyModal: DestroyComponent;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    protected settingsService: SettingsService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected contextService: ContextService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/schedules');
  }

  isScheduleReady(state: ClrDatagridStateInterface): boolean {
    const params = this.getParams(state, {platform: ''});
    return super.isReady() && params.platform;
  }

  refresh(state: ClrDatagridStateInterface): void {
    if (this.isScheduleReady(state)) {
      super.refresh(state);
      const params = this.getParams(state, {platform: ''});
      this.unsubscribe$ = this.scheduleService.getSchedules('', params.platform).subscribe(
        (page: SchedulePage) => {
          this.page = page;
          this.selected = this.grouped ? [] : null;
          this.updateGroupContext(params);
          this.loading = false;
        },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
        }
      );
    }
  }

  details(schedule: Schedule): void {
    this.router.navigateByUrl(`tasks-jobs/schedules/${schedule.name}`);
  }

  taskDetails(schedule: Schedule): void {
    this.router.navigateByUrl(`tasks-jobs/tasks/${schedule.taskName}`);
  }

  destroySchedules(schedules: Schedule[]): void {
    this.destroyModal.open(schedules);
  }

  createSchedule(schedule: Schedule): void {
    this.router.navigateByUrl(`tasks-jobs/schedules/${schedule.taskName}/create`);
  }
}
