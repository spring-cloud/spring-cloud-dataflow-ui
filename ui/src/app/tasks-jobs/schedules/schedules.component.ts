import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../shared/api/schedule.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Schedule, SchedulePage } from '../../shared/model/schedule.model';
import { DestroyComponent } from './destroy/destroy.component';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
})
export class SchedulesComponent extends DatagridComponent {
  page: SchedulePage;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;

  constructor(private scheduleService: ScheduleService,
              private router: Router,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected contextService: ContextService) {
    super(contextService, settingsService, changeDetectorRef, 'tasks-jobs/schedules');
  }

  isScheduleReady(state): boolean {
    const params = this.getParams(state, { platform: '' });
    return super.isReady() && params.platform;
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isScheduleReady(state)) {
      super.refresh(state);
      const params = this.getParams(state, { platform: '' });
      this.unsubscribe$ = this.scheduleService.getSchedules('', params.platform)
        .subscribe((page: SchedulePage) => {
          this.page = page;
          this.selected = [];
          this.updateGroupContext(params);
          this.loading = false;
        });
    }
  }

  details(schedule: Schedule) {
    this.router.navigateByUrl(`tasks-jobs/schedules/${schedule.name}`);
  }

  taskDetails(schedule: Schedule) {
    this.router.navigateByUrl(`tasks-jobs/tasks/${schedule.taskName}`);
  }

  destroySchedules(schedules: Schedule[]) {
    this.destroyModal.open(schedules);
  }

  createSchedule(schedule: Schedule) {
    this.router.navigateByUrl(`tasks-jobs/schedules/${schedule.taskName}/create`);
  }

}
