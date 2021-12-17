import {Component, OnInit} from '@angular/core';
import {map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GroupService} from '../../../shared/service/group.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {forkJoin, throwError} from 'rxjs';
import {ScheduleService} from '../../../shared/api/schedule.service';
import {Schedule, SchedulePage} from '../../../shared/model/schedule.model';
import {TaskService} from '../../../shared/api/task.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {SchedulesCreateValidator} from './create.validator';
import {KeyValueValidator} from '../../../shared/component/key-value/key-value.validator';
import {TaskPropValidator} from '../../tasks/task-prop.validator';
import {Task} from '../../../shared/model/task.model';
import {Platform} from '../../../shared/model/platform.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-schedules-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  loading = true;
  creating = false;
  form: FormGroup;
  config: any;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap((params: Params) => {
          if (this.groupService.isSimilar(params.id)) {
            if (this.groupService.group(params.id)) {
              return forkJoin([...(this.groupService.group(params.id) as any)].map(id => this.taskService.getTask(id)));
            } else {
              return throwError(this.translate.instant('schedules.create.message.groupSeclectionNotFoundTitle'));
            }
          } else {
            return forkJoin([this.taskService.getTask(params.id)]);
          }
        }),
        mergeMap(tasks =>
          this.taskService.getPlatforms().pipe(
            map((platforms: Platform[]) => ({
              tasks,
              platforms
            }))
          )
        ),
        mergeMap(({tasks, platforms}: {tasks: Array<Task>; platforms: Array<Platform>}) =>
          forkJoin([...platforms.map(platform => this.scheduleService.getSchedules('', platform.name))]).pipe(
            map((schedules: SchedulePage[]) => {
              const names = [];
              schedules.forEach((page: SchedulePage) => {
                names.push(...page.items.map(item => item.name.toLowerCase()));
              });
              return {
                tasks,
                platforms,
                schedules: names
              };
            })
          )
        )
      )
      .subscribe(
        config => {
          this.buildForm(config);
          this.config = config;
          this.loading = false;
        },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
          this.back();
        }
      );
  }

  buildForm({
    tasks,
    schedules,
    platforms
  }: {
    tasks: Array<Task>;
    schedules: string[];
    platforms: Array<Platform>;
  }): void {
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
    const names = new FormArray(
      tasks.map(
        () =>
          new FormControl('', [
            Validators.required,
            (control: FormControl) => SchedulesCreateValidator.existName(control, schedules)
          ])
      ),
      [SchedulesCreateValidator.uniqueName]
    );
    this.form = new FormGroup({
      cron: new FormControl('', [Validators.required, SchedulesCreateValidator.cron]),
      names: names,
      args: new FormControl('', KeyValueValidator.validateKeyValue(validators.args)),
      props: new FormControl('', KeyValueValidator.validateKeyValue(validators.props)),
      platform: new FormControl(platforms.length > 1 ? '' : platforms[0].name, Validators.required)
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
    } else {
      this.creating = true;
      const getClean = (val: string): Array<string> => val.split('\n').filter(a => a !== '');
      const {tasks} = this.config;
      const taskArguments = getClean(this.form.get('args').value);
      const taskProperties = getClean(this.form.get('props').value);
      const cronExpression = this.form.get('cron').value;
      const platform = this.form.get('platform').value;
      const scheduleParams = tasks.map((task: Task, index: number) => ({
        args: taskArguments.join(' '),
        props: taskProperties.join(','),
        cronExpression: cronExpression,
        task: task.name,
        platform: platform,
        schedulerName: (this.form.get('names') as FormArray).controls.map((control: FormControl) => control.value)[
          index
        ]
      }));
      this.scheduleService.createSchedules(scheduleParams).subscribe(
        () => {
          if (scheduleParams.length === 1) {
            this.notificationService.success(
              this.translate.instant('schedules.create.message.scheculeSuccessTitle'),
              this.translate.instant('schedules.create.message.scheculeSuccessContent', {
                name: scheduleParams[0].schedulerName
              })
            );
          } else {
            this.notificationService.success(
              this.translate.instant('schedules.create.message.scheculesSuccessTitle'),
              this.translate.instant('schedules.create.message.scheculesSuccessContent', {count: scheduleParams.length})
            );
          }
          this.back();
        },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
          this.creating = false;
        }
      );
    }
  }

  back(): void {
    this.router.navigateByUrl('tasks-jobs/schedules');
  }
}
