import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationService } from '../../../shared/service/notification.service';
import { ScheduleService } from '../../../shared/api/schedule.service';
import { Schedule } from '../../../shared/model/schedule.model';

@Component({
  selector: 'app-schedule-destroy',
  templateUrl: './destroy.component.html'
})
export class DestroyComponent {
  schedules: Schedule[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(private scheduleService: ScheduleService,
              private notificationService: NotificationService) {
  }

  open(schedules: Schedule[]) {
    this.isRunning = false;
    this.schedules = schedules;
    this.isOpen = true;
  }

  destroy() {
    this.isRunning = true;
    this.scheduleService.destroySchedules(this.schedules.map(schedule => {
      return {
        name: schedule.name,
        platform: schedule.platform
      };
    })).subscribe(
      data => {
        this.notificationService.success('Delete schedule(s)', `${data.length} schedule(s) deleted.`);
        this.onDestroyed.emit(data);
        this.isOpen = false;
        this.schedules = null;
      }, error => {
        this.notificationService.error('An error occurred', 'An error occurred while deleting schedule(s). ' +
          'Please check the server logs for more details.');
        this.isOpen = false;
        this.schedules = null;
      });
  }

}
