import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Subscription } from 'rxjs/Subscription';
import { TasksService } from '../tasks.service';
import { AppInfo, AppInfoOptions } from '../model/app-info';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;
  form: FormGroup;
  iform: FormGroup;
  busy: Subscription;
  definitionName = new FormControl('');
  appInfo: AppInfo;
  definition: string;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
    fb: FormBuilder
  ) {
      this.form = fb.group({
        'definitionName': this.definitionName
      });
      this.iform = fb.group({});
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];
        this.busy = this.tasksService.getAppInfo(this.id).subscribe(
          data => {
            for (const o of data.options) {
              const control: FormControl = new FormControl(o.defaultValue);
              control.valueChanges.map(x => {
                this.calculateDefinition();
              }).subscribe();
              this.form.addControl(o.id, control);
              const icontrol: FormControl = new FormControl(false);
              icontrol.valueChanges.map(x => {
                this.calculateDefinition();
              }).subscribe();
              this.iform.addControl(o.id + '.include', icontrol);
            }
            this.appInfo = data;
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
    this.tasksService.createDefinition(def, this.definitionName.value).subscribe();
    this.router.navigate(['tasks/definitions']);
  }

  calculateDefinition() {
    let def: string = this.appInfo.name;
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>this.form.controls[key];
        if (this.iform.contains(key + '.include')) {
          const icontrol: FormControl = <FormControl>this.iform.controls[key + '.include'];
          if (icontrol.value === true) {
            def = def + ' --' + key + '="' + control.value + '"';
          }
        }
      }
    }
    this.definition = def;
    return def;
  }

}
