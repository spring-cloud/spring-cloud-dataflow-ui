import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TasksService } from '../../tasks.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { AppError } from '../../../shared/model/error.model';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

/**
 * Component to display dialog to allow user to name and deploy a task.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./styles.scss']
})
export class TaskDefinitionCreateDialogComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Shown and used dsl for task.
   */
  dsl: string;

  /**
   * Shown generic errors in a dialog.
   */
  errors: Array<string>;

  /**
   * Shown generic warnings in a dialog.
   */
  warnings: Array<string>;

  /**
   * The FormGroup having dialog controls.
   * @type {FormGroup}
   */
  form: FormGroup;

  /**
   * The FormControl used to capture the task name.
   * @type {FormControl}
   */
  taskName = new FormControl('', validateTaskName);

  /**
   * Callback to parent which is called when task is created succesfully.
   */
  successCallback: () => void;

  constructor(private tasksService: TasksService,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private blockerService: BlockerService,
              private bsModalRef: BsModalRef) {
    this.form = fb.group({
      'taskName': this.taskName
    });
  }

  ngOnInit() {
    this.errors = new Array<string>();
    this.warnings = new Array<string>();
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Sets a dsl used to create a task.
   * @param {string} the task dsl
   */
  setDsl(dsl: string) {
    this.loggerService.log('dsl', dsl);
    this.dsl = dsl;
  }

  /**
   * Handles cancel operation of this dialog.
   */
  handleCancel() {
    this.bsModalRef.hide();
  }

  /**
   * Handles creation of a task with TasksService. Hides dialog and
   * calls success callback which gives parent a change to do its
   * actions, i.e. clearing a flo graph.
   */
  handleCreate() {
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      this.blockerService.lock();
      this.tasksService.createDefinition({ name: this.taskName.value, definition: this.dsl })
        .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          () => {
            this.loggerService.log('Succesfully created task', this.taskName.value, this.dsl);
            if (this.successCallback) {
              this.successCallback();
            }
            this.bsModalRef.hide();
            this.notificationService.success('Composed task created for ' + this.taskName.value);
          },
          (error) => {
            this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
            this.bsModalRef.hide();
          }
        );
    }
  }

  /**
   * Used in a dialog to disable submit button.
   * @returns {boolean} returns true if ready to submit
   */
  canSubmit(): boolean {
    this.loggerService.log('canSubmit');
    return this.form.valid;
  }

}

/**
 * Validates the task name.
 *
 * @param formControl the form that contains the task name input.
 * @returns {any} null if successful or the validateProperties message if a failure.
 */
function validateTaskName(formControl: FormControl) {
  if (formControl.value.length > 0) {
    return null;
  } else {
    return { validateTaskName: { reason: 'Cannot be empty' } };
  }
}
