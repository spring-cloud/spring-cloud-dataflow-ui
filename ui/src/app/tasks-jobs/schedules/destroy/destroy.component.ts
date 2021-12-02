import {Component, EventEmitter, Output} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ScheduleService} from '../../../shared/api/schedule.service';
import {Schedule} from '../../../shared/model/schedule.model';

@Component({
  selector: 'app-schedule-destroy',
  templateUrl: './destroy.component.html'
})
export class DestroyComponent {
  schedules: Schedule[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(private scheduleService: ScheduleService, private notificationService: NotificationService) {}

  open(schedules: Schedule[]): void {
    this.isRunning = false;
    this.schedules = schedules;
    this.isOpen = true;
  }

  destroy(): void {
    this.isRunning = true;
    this.scheduleService
      .destroySchedules(
        this.schedules.map(schedule => ({
          name: schedule.name,
          platform: schedule.platform
        }))
      )
      .subscribe(
        data => {
          this.notificationService.success($localize `Delete schedule(s)`, `${data.length}` + $localize ` schedule(s) deleted.`);
          this.onDestroyed.emit(data);
          this.isOpen = false;
          this.schedules = null;
        },
        error => {
          this.notificationService.error(
            $localize `An error occurred`,
            $localize `An error occurred while deleting schedule(s). Please check the server logs for more details.`
          );
          this.isOpen = false;
          this.schedules = null;
        }
      );
  }
}
