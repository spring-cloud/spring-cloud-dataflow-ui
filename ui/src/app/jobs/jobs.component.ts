import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Page } from '../shared/model';
import { JobsService } from './jobs.service';
import { JobExecution } from './model/job-execution.model';

import { ToastyService } from 'ng2-toasty';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  public jobExecutions: Page<JobExecution>;

  constructor(
    private busyService: BusyService,
    private jobsService: JobsService,
    private toastyService: ToastyService,
    private router: Router
  ) { }

  /**
   * As soon as the page loads we retrieve a list
   * of {@link JobExecution}s.
   */
  ngOnInit() {
    this.loadJobExecutions(true);
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
   * Load a paginated list of {@link JobExecution}s.
   *
   * @param reload
   */
  public loadJobExecutions(reload: boolean) {
    const busy = this.jobsService.getJobExecutions(reload)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        if (!this.jobExecutions) {
          this.jobExecutions = data;
        }
      },
      error => {
        console.log('error while loading Job Executions', error);
        this.toastyService.error(error);
      }
    );
    this.busyService.addSubscription(busy);
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.jobsService.jobExecutions.pageNumber = page - 1;
    this.loadJobExecutions(true);
  }

  restartJob(item: JobExecution) {
    console.log('Restart Job ' + item.jobExecutionId);
    this.jobsService.restartJob(item)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success('Successfully restarted job "' + item.name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  stopJob(item: JobExecution) {
    console.log('Stop Job' + item.jobExecutionId);
    this.jobsService.stopJob(item)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success('Successfully stopped job "' + item.name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  viewJobExecutionDetails(item: JobExecution) {
    this.router.navigate(['jobs/executions/' + item.jobExecutionId]);
  }

  viewTaskExecutionDetails(item: JobExecution) {
    this.router.navigate(['tasks/executions/' + item.taskExecutionId]);
  }
}
