import { Component, ViewChild } from '@angular/core';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { Router } from '@angular/router';
import { ContextService } from '../../shared/service/context.service';
import { ScheduleService } from '../../shared/api/schedule.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Schedule, SchedulePage } from '../../shared/model/schedule.model';
import { DestroyComponent } from './destroy/destroy.component';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
})
export class SchedulesComponent extends DatagridComponent {
  page: SchedulePage;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;

  constructor(private scheduleService: ScheduleService,
              private router: Router,
              protected contextService: ContextService) {
    super(contextService, 'schedules');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      // const params = this.getParams(state, { name: '', type: '' });
      this.scheduleService.getSchedules('')
        .subscribe((page: SchedulePage) => {
          this.attachColumns();
          this.page = page;
          this.selected = [];
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
