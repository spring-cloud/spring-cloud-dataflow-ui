import { Component, OnInit } from '@angular/core';
import { Task } from '../../../shared/model/task.model';
import { TaskService } from '../../../shared/api/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyValueValidator } from '../../../shared/component/key-value/key-value.validator';
import { TaskPropValidator } from '../task-prop.validator';
import { Platform } from '../../../shared/model/platform.model';
import { NotificationService } from '../../../shared/service/notification.service';
import { HttpError } from '../../../shared/model/error.model';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styles: []
})
export class LaunchComponent implements OnInit {
  loading = true;
  submitting = false;
  task: Task;
  form: FormGroup;
  platforms: Platform[];

  constructor(private taskService: TaskService,
              private router: Router,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(
          params => {
            this.task = new Task();
            this.task.name = params.name;
            return this.taskService.getTask(params.name, true);
          }
        ),
        map((task: Task) => {
          let parameters = '';
          if (task.lastTaskExecution && task.lastTaskExecution.deploymentProperties) {
            parameters = Object.keys(task.lastTaskExecution.deploymentProperties)
              .map(key => (task.lastTaskExecution.deploymentProperties[key] === '******')
                ? ''
                : `${key}=${task.lastTaskExecution.deploymentProperties[key]}`
              )
              .filter(param => !!param)
              .join('\n');
          }
          return {
            task,
            parameters
          };
        }),
        mergeMap(
          ({ task, parameters }) => this.taskService.getPlatforms().pipe(
            map(platforms => ({
              platforms,
              task,
              parameters
            }))
          )
        )
      )
      .subscribe(({ task, parameters, platforms }) => {
        this.task = task;
        this.platforms = platforms;
        this.form = new FormGroup({
          args: new FormControl('', KeyValueValidator.validateKeyValue({
            key: [Validators.required],
            value: []
          })),
          props: new FormControl(parameters, KeyValueValidator.validateKeyValue({
            key: [Validators.required, TaskPropValidator.key],
            value: []
          })),
          platform: new FormControl('', platforms.length > 0 ? Validators.required : null)
        });
        this.form.get('platform').setValue(platforms[0].name);
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.back();
        }
      });
  }

  prepareParams(name: string, args: Array<string>, props: Array<string>, platform: string): any {
    if (platform && platform !== 'default') {
      props.push(`spring.cloud.dataflow.task.platformName=${platform}`);
    }
    return {
      name,
      args: args.filter((a) => a !== '').join(' '),
      props: props.filter((a) => a !== '').join(', ')
    };
  }

  launch() {
    if (this.submitting) {
      return;
    }
    if (this.form.valid) {
      this.submitting = true;
      const params = this.prepareParams(this.task.name, this.form.get('args').value.toString().split('\n'),
        this.form.get('props').value.toString().split('\n'), this.form.get('platform').value);
      this.taskService.launch(params.name, params.args, params.props)
        .subscribe(
          data => {
            this.notificationService.success('Launch task', 'Successfully launched task "' + this.task.name + '"');
            this.submitting = false;
            this.back();
          },
          error => {
            this.submitting = false;
            this.notificationService.error('An error occurred', error);
          }
        );
    } else {
      this.notificationService.error('An error occurred', 'Some field(s) are missing or invalid.');
    }
  }

  back() {
    this.router.navigate(['/tasks-jobs/tasks']);
  }
}
