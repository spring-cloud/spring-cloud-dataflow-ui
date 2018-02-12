import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { TasksService } from '../tasks.service';
import { AppInfo } from '../model/app-info';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

/**
 *  @author Glenn Renfro
 *  @author Gunnar Hillert 
 */
@Component({
  selector: 'app-task-app-details',
  templateUrl: './task-app-details.component.html',
})
export class TaskAppDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: string;
  appInfo: AppInfo;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = params['id'];

       this.tasksService.getAppInfo(this.id)
       .pipe(takeUntil(this.ngUnsubscribe$))
       .subscribe(
         data => {
           this.appInfo = data;
           this.toastyService.success('App info loaded.');
         }
       );
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.  
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  back() {
    this.router.navigate(['tasks/apps']);
  }
}
