import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { TasksService } from '../tasks.service';
import { ToastyService } from 'ng2-toasty';

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
    private toastyService: ToastyService,
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
    const definitions = this.definitions.value.split('\n');

    const observables: Observable<Response>[] = [];

    console.log(`Bulk-Define ${definitions.length} Task(s)`);
    if (this.definitions.value) {
      for (const def of definitions) {
        if (def.length > 2) {
          const keyValue = def.split('=');
          if (keyValue.length === 2) {
            const observable = this.tasksService.createDefinition(keyValue[1], keyValue[0])
            .catch(error => {
              return Observable.of({
                isError: true,
                errorMessage: error
              });
            });
            observables.push(observable);
          }
        }
      }
    }
    Observable.forkJoin(observables).subscribe(
      data => {
        let completed = 0;
        let failed = 0;
        for (const dataItem of data as any) {
          if (dataItem.isError) {
            this.toastyService.error(dataItem.errorMessage);
            failed++;
          } else {
            completed++;
          }
        }
        if (failed === 0) {
          this.toastyService.success(`${data.length} task(s) defined.`);
          this.router.navigate(['tasks/definitions']);
        } else if (failed > 0 && completed > 0) {
          this.toastyService.error(`${failed} of ${data.length} task(s) could not be defined.`);
        } else {
          this.toastyService.error(`All ${data.length} task(s) could not be defined.`);
        }
      }
    );
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
    };
    reader.readAsText(file);
  }
}
