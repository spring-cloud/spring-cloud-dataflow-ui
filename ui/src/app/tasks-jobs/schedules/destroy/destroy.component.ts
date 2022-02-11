import {Component, EventEmitter, Output} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ScheduleService} from '../../../shared/api/schedule.service';
import {Schedule} from '../../../shared/model/schedule.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-schedule-destroy',
  templateUrl: './destroy.component.html'
})
export class DestroyComponent {
  schedules: Schedule[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(
    private scheduleService: ScheduleService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

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
          this.notificationService.success(
            this.translate.instant('schedules.destroy.message.successTitle'),
            this.translate.instant('schedules.destroy.message.successContent', {count: data.length})
          );
          this.onDestroyed.emit(data);
          this.isOpen = false;
          this.schedules = null;
        },
        error => {
          this.notificationService.error(
            this.translate.instant('commons.message.error'),
            this.translate.instant('schedules.destroy.message.errorContent')
          );
          this.isOpen = false;
          this.schedules = null;
        }
      );
  }
}
