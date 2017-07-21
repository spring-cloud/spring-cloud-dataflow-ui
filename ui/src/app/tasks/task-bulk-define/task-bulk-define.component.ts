import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { validateBulkTaskDefinitions } from './task-bulk-define-validators';

@Component({
  selector: 'app-task-bulk-define',
  templateUrl: './task-bulk-define.component.html',
})
export class TaskBulkDefineComponent implements OnInit {

  form: FormGroup;
  definitions = new FormControl('', validateBulkTaskDefinitions);

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      'definitions': this.definitions
    });
  }

  ngOnInit() {
  }

  cancelBulkDefineTasks() {
    this.router.navigate(['tasks/definitions']);
  }

  bulkDefineTasks() {
    console.log('bulkDefineTasks')
    if (this.definitions.value) {
      for (const def of this.definitions.value.split('\n')) {
        if (def.length > 2) {
          const keyValue = def.split('=');
          if (keyValue.length === 2) {
            this.tasksService.createDefinition(keyValue[1], keyValue[0]).subscribe();
          }
        }
      }
    }
  }

  /**
   * Used to read the task definitions from a flat file
   * @param event The event from the file selection dialog.
   */
  displayFileContents(event: any) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    const _form = this.form;
    reader.onloadend = function(e){
      _form.patchValue({definitions: reader.result});
    }
    reader.readAsText(file);
  }
}
