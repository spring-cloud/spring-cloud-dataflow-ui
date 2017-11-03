import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ToastyService } from 'ng2-toasty';
import { Subscription } from 'rxjs/Subscription';
import { TasksService } from '../tasks.service';
import { AppInfo } from '../model/app-info';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;
  mainForm: FormGroup;
  includeForm: FormGroup;
  busy: Subscription;
  definitionName = new FormControl('', (c: FormControl) => this.validateDefinitionName(c));
  appInfo: AppInfo;
  definition: string;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    fb: FormBuilder) {
      this.mainForm = fb.group({
        'definitionName': this.definitionName
      });
      this.includeForm = fb.group({});
  }

  ngOnInit() {
    this.definitionName.valueChanges.do(next => {
      this.calculateDefinition();
    }).subscribe();
    this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];
        this.busy = this.tasksService.getAppInfo(this.id).subscribe(
          data => {
            for (const o of data.options) {
              const control: FormControl = new FormControl(o.defaultValue);
              control.valueChanges.do(next => {
                this.calculateDefinition();
              }).subscribe();
              this.mainForm.addControl(o.id, control);
              const icontrol: FormControl = new FormControl(false);
              icontrol.valueChanges.do(next => {
                this.calculateDefinition();
              }).subscribe();
              this.includeForm.addControl(o.id + '.include', icontrol);
            }
            this.appInfo = data;
            this.calculateDefinition();
            this.toastyService.success('App info loaded.');
          }
       );
     });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  back() {
    this.router.navigate(['tasks/apps']);
  }

  submitTaskDefinition() {
    const def = this.calculateDefinition();
    this.tasksService.createDefinition(def, this.definitionName.value).subscribe(
      data => {
        this.toastyService.success('Task definition create requested');
        this.router.navigate(['tasks/definitions']);
      },
      error => {
        this.toastyService.error(error);
        this.router.navigate(['tasks/definitions']);
      }
    );

  }

  private calculateDefinition() {
    let def: string = this.appInfo.name;
    for (const key in this.mainForm.controls) {
      if (this.mainForm.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>this.mainForm.controls[key];
        if (this.includeForm.contains(key + '.include')) {
          const icontrol: FormControl = <FormControl>this.includeForm.controls[key + '.include'];
          if (icontrol.value === true) {
            def = def + ' --' + key + '="' + control.value + '"';
          }
        }
      }
    }
    this.definition = def;
    return def;
  }

  private validateDefinitionName(formControl: FormControl) {
    if (formControl.value.length > 0) {
      if (formControl.value === this.id) {
        return {validateDefinitionName: {reason: 'Cannot be same as ' + this.id + '.'}};
      } else if (formControl.value.indexOf(' ') >= 0) {
        return {validateDefinitionName: {reason: 'Cannot have spaces.'}};
      } else {
        return null;
      }
    } else {
      return {validateDefinitionName: {reason: 'Cannot be empty.'}};
    }
  }
}
