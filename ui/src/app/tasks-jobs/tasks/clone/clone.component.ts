import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../shared/service/notification.service';
import {of} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {Utils} from '../../../flo/stream/support/utils';
import {TaskService} from '../../../shared/api/task.service';
import {TaskPage} from '../../../shared/model/task.model';

@Component({
  selector: 'app-task-clone',
  templateUrl: './clone.component.html',
  styles: []
})
export class CloneComponent {
  isOpen = false;
  form: FormGroup;
  tasks: Array<any>;
  names: string[];
  loading = false;
  isRunning = false;
  @Output() onCloned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  open(tasks: Array<any>): void {
    this.tasks = tasks;
    this.form = this.fb.group({}, {validators: [this.uniqueTaskNames()]});
    this.loading = true;
    this.isRunning = false;
    this.isOpen = true;
    this.refresh();
  }

  refresh(): void {
    this.taskService.getTasks(0, 10000).subscribe((page: TaskPage) => {
      this.names = page.items.map(task => task.name);
      this.tasks.forEach(task => {
        const newName = this.generateName(task.name);
        this.form.addControl(
          task.name,
          new FormControl(newName, [
            Validators.required,
            this.uniqueTaskName(),
            Validators.pattern(/^[a-zA-Z0-9\-]+$/),
            Validators.maxLength(255)
          ])
        );
      });
      this.loading = false;
    });
  }

  generateName(taskName: string, loop = 1): string {
    let newName = `${taskName}-Copy`;
    if (loop > 1) {
      newName = `${newName}-${loop}`;
    }
    if (this.names.find(name => name === newName)) {
      return this.generateName(taskName, loop + 1);
    }
    return newName;
  }

  cancel(): void {
    this.isOpen = false;
  }

  done(success: number, error: number): void {
    if (success > 0) {
      if (error > 0) {
        this.notificationService.success('Task(s) clone', 'Task(s) have been cloned partially');
      } else {
        this.notificationService.success('Task(s) clone', 'Task(s) have been cloned successfully');
      }
      this.onCloned.emit(true);
      this.cancel();
    } else {
      this.notificationService.error('Error(s) occurred', 'No task(s) cloned.');
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Invalid field', 'Some field(s) are missing or invalid.');
      return;
    }
    const requests = this.tasks.map(task => {
      const target = this.form.get(task.name).value;
      return this.taskService.createTask(target, task.dslText, task.description);
    });
    let count = 0;
    let success = 0;
    let error = 0;

    of(...requests)
      .pipe(concatAll())
      .subscribe(
        () => {
          count++;
          success++;
          if (count === requests.length) {
            this.done(success, error);
          }
        },
        err => {
          count++;
          error++;
          this.notificationService.error('Error(s) occurred', err);
          if (count === requests.length) {
            this.done(success, error);
          }
        }
      );
  }

  uniqueTaskNames(): any {
    return (control: FormGroup): {[key: string]: any} => {
      let values = [];
      if (control && this.names) {
        values = (this.names || []).map(name => (control.get(name) ? control.get(name).value : '')).filter(s => !!s);
      }
      const duplicates = Utils.findDuplicates(values);
      return duplicates.length === 0 ? null : {uniqueTaskNames: duplicates};
    };
  }

  uniqueTaskName(): any {
    return (control: FormControl): {[key: string]: any} => {
      if (control.value && this.names) {
        if (this.names.indexOf(control.value) > -1) {
          return {uniqueTaskName: true};
        }
      }
      return null;
    };
  }
}
