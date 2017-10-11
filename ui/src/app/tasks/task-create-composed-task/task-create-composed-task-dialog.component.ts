import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { TasksService } from '../tasks.service';

/**
 * Component to display dialog to allow user to name and deploy a task.
 *
 * @author Janne Valkealahti
 */
@Component({
  selector: 'app-task-create-composed-task-dialog',
  templateUrl: './task-create-composed-task-dialog.component.html',
  styleUrls: ['./task-create-composed-task-dialog.component.scss']
})
export class TaskCreateComposedTaskDialogComponent implements OnInit {

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

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private toastyService: ToastyService,
    private bsModalRef: BsModalRef
  ) {
    this.form = fb.group({
      'taskName': this.taskName
    });
  }

  ngOnInit() {
    this.errors = new Array<string>();
    this.warnings = new Array<string>();
  }

  /**
   * Sets a dsl used to create a task.
   * @param {string} the task dsl
   */
  setDsl(dsl: string) {
    console.log('dsl', dsl);
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
    this.tasksService.createDefinition(this.dsl, this.taskName.value).subscribe(
      () => {
        console.log('Succesfully created task', this.taskName.value, this.dsl);
        if (this.successCallback) {
          this.successCallback();
        }
        this.bsModalRef.hide();
        this.toastyService.success('Composed task created for ' + this.taskName.value);
      },
      (error) => {
        this.toastyService.error(error);
        this.bsModalRef.hide();
      }
    );
  }

  /**
   * Used in a dialog to disable submit button.
   * @returns {boolean} returns true if ready to submit
   */
  canSubmit(): boolean {
    console.log('canSubmit');
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
    return {validateTaskName: {reason: 'Cannot be empty'}};
  }
}
