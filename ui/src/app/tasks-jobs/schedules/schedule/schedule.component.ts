import { Component, OnInit, ViewChild } from '@angular/core';
import { Schedule } from '../../../shared/model/schedule.model';
import { Task } from '../../../shared/model/task.model';
import { map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from '../../../shared/api/task.service';
import { ScheduleService } from '../../../shared/api/schedule.service';
import { HttpError } from '../../../shared/model/error.model';
import { NotificationService } from '../../../shared/service/notification.service';
import { DestroyComponent } from '../destroy/destroy.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {

  isLoading = true;
  schedule: Schedule;
  task: Task;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private scheduleService: ScheduleService,
              private notificationService: NotificationService,
              private taskService: TaskService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.route.params.pipe(
      mergeMap(
        (params: Params) => {
          this.schedule = new Schedule();
          this.schedule.name = params.id;
          return this.scheduleService.getSchedule(params.id);
        },
      ),
      map((schedule: Schedule) => {
        this.schedule = schedule;
        return schedule;
      }),
      mergeMap(
        (schedule: Schedule) => this.taskService.getTask(schedule.taskName)
      )
    ).subscribe((task: Task) => {
      this.task = task;
      this.isLoading = false;
    }, (error) => {
      this.notificationService.error('An error occurred', error);
      if (HttpError.is404(error)) {
        this.back();
      }
    });
  }

  destroy() {
    this.destroyModal.open([this.schedule]);
  }

  detailsTask() {
    this.router.navigateByUrl(`tasks-jobs/tasks/${this.schedule.taskName}`);
  }

  back() {
    this.router.navigateByUrl(`tasks-jobs/schedules`);
  }

}
