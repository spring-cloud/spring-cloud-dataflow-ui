import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { TasksService } from '../tasks.service';
import { AppInfo, AppInfoOptions } from '../model/app-info';

@Component({
  selector: 'app-task-app-details',
  templateUrl: './task-app-details.component.html',
})

export class TaskAppDetailsComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;
  busy: Subscription;
  appInfo: AppInfo;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];

       this.busy = this.tasksService.getAppInfo(this.id).subscribe(
         data => {
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
}
