import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskExecution } from '../model/task-execution';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { TasksService } from '../tasks.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
})

export class TaskExecutionsDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: string;
  taskExecution: TaskExecution;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService,
  ) {
  }

  ngOnInit() {
    this.route.params
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(params => {
       this.id = params['id'];

       this.tasksService.getExecution(this.id)
       .pipe(takeUntil(this.ngUnsubscribe$))
       .subscribe(
         data => {
           this.taskExecution = data;
           this.toastyService.success('Task Execution loaded.');
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
    this.router.navigate(['tasks/executions']);
  }

  /**
   * Redirect user to the page for the provided Job Execution Id.
   *
   * @param jobExecutionId Id of the Job Execution
   */
  goToJobExecution(jobExecutionId: number) {
    this.router.navigate(['jobs/executions/' + jobExecutionId]);
  }

}
