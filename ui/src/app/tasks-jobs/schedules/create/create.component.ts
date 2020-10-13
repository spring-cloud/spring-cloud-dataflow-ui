import { Component, OnInit } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GroupService } from '../../../shared/service/group.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { forkJoin, throwError } from 'rxjs';
import { ScheduleService } from '../../../shared/api/schedule.service';
import { SchedulePage } from '../../../shared/model/schedule.model';
import { TaskService } from '../../../shared/api/task.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SchedulesCreateValidator } from './create.validator';
import { KeyValueValidator } from '../../../shared/component/key-value/key-value.validator';
import { TaskPropValidator } from '../../tasks/task-prop.validator';
import { Task } from '../../../shared/model/task.model';
import { Platform } from '../../../shared/model/platform.model';

@Component({
  selector: 'app-schedules-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  loading = true;
  creating = false;
  form: FormGroup;
  config: any;

  constructor(private groupService: GroupService,
              private router: Router,
              private route: ActivatedRoute,
              private scheduleService: ScheduleService,
              private taskService: TaskService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.route.params.pipe(
      mergeMap(
        (params: Params) => {
          if (this.groupService.isSimilar(params.id)) {
            if (this.groupService.group(params.id)) {
              return forkJoin([...(this.groupService.group(params.id) as any)]
                .map((id) => this.taskService.getTask(id)));
            } else {
              return throwError(`Group selection not found.`);
            }
          } else {
            return forkJoin([this.taskService.getTask(params.id)]);
          }
        }
      ),
      mergeMap(
        (tasks) => this.taskService.getPlatforms()
          .pipe(
            map((platforms: Platform[]) => {
              return {
                tasks,
                platforms
              };
            })
          )
      ),
      mergeMap(
        ({ tasks, platforms }) => forkJoin([...platforms.map((platform) =>
          this.scheduleService.getSchedules('', platform.name)
        )]).pipe(
          map((schedules: SchedulePage[]) => {
            const names = [];
            schedules.forEach((page: SchedulePage) => {
              names.push(...page.items.map((item) => item.name.toLowerCase()));
            });
            return {
              tasks,
              platforms,
              schedules: names
            };
          })
        )
      )
    ).subscribe((config) => {
      this.buildForm(config);
      this.config = config;
      this.loading = false;
    }, (error) => {
      this.notificationService.error('An error occurred', error);
      this.back();
    });
  }

  buildForm({ tasks, schedules, platforms }) {
    const validators = {
      args: {
        key: [Validators.required],
        value: []
      },
      props: {
        key: [Validators.required, TaskPropValidator.key],
        value: []
      }
    };
    const names = new FormArray(tasks.map(() => {
      return new FormControl('', [
        Validators.required, ((control: FormControl) => {
          return SchedulesCreateValidator.existName(control, schedules);
        })
      ]);
    }), [SchedulesCreateValidator.uniqueName]);
    this.form = new FormGroup({
      'cron': new FormControl('', [Validators.required, SchedulesCreateValidator.cron]),
      'names': names,
      'args': new FormControl('', KeyValueValidator.validateKeyValue(validators.args)),
      'props': new FormControl('', KeyValueValidator.validateKeyValue(validators.props)),
      'platform': new FormControl(platforms.length > 1 ? '' : platforms[0].name, Validators.required)
    });
  }

  submit() {
    if (!this.form.valid) {
      this.notificationService.error('Invalid field(s)', 'Some field(s) are missing or invalid.');
    } else {
      this.creating = true;
      const getClean = (val: string): Array<string> => val.split('\n')
        .filter((a) => a !== '');
      const { tasks } = this.config;
      const taskArguments = getClean(this.form.get('args').value);
      const taskProperties = getClean(this.form.get('props').value);
      const cronExpression = this.form.get('cron').value;
      const platform = this.form.get('platform').value;
      const scheduleParams = tasks
        .map((task: Task, index: number) => ({
            args: taskArguments.join(' '),
            props: taskProperties.join(','),
            cronExpression: cronExpression,
            task: task.name,
            platform: platform,
            schedulerName: (this.form.get('names') as FormArray).controls
              .map((control: FormControl) => control.value)[index]
          })
        );
      this.scheduleService.createSchedules(scheduleParams)
        .subscribe(() => {
            if (scheduleParams.length === 1) {
              this.notificationService.success(`Schedule creation`, `Successfully schedule creation "${scheduleParams[0].schedulerName}"`);
            } else {
              this.notificationService.success(`Schedules creation`, `Successfully ${scheduleParams.length} schedules creation`);
            }
            this.back();
          },
          error => {
            this.notificationService.error('An error occurred', error);
            this.creating = false;
          }
        );
    }
  }

  back() {
    this.router.navigateByUrl(`tasks-jobs/schedules`);
  }
}
