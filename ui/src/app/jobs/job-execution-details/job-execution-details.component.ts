import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobsService } from '../jobs.service';
import { JobExecution } from '../model/job-execution.model';
import { StepExecution } from '../model/step-execution.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Displays a job's execution detail information based on the job execution id that is passed in via params on the URI.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-job-execution-details',
  templateUrl: './job-execution-details.component.html'
})
export class JobExecutionDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: string;
  jobExecution: JobExecution;

  constructor(
    private jobsService: JobsService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Retrieves the JobExecutionId from the JobService.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.jobsService.getJobExecution(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
        this.jobExecution = data;
        },
        error => {
          console.log('error while loading Job Execution Details', error);
          this.notificationService.error(error);
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

  /**
   * Navigates to the view step execution page.
   *
   * @param {StepExecution} item the id of the StepExecution is used to construct the URI parameters along with the
   * JobExecutionId.
   */
  viewStepExecutionDetails(item: StepExecution) {
    this.router.navigate(['jobs/executions/' + this.id + '/' + item.id]);
  }

  back() {
    this.router.navigate(['jobs/executions']);
  }
}
