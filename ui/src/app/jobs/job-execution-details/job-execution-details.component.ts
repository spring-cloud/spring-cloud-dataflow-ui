import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobsService } from '../jobs.service';
import { JobExecution } from '../model/job-execution.model';
import { StepExecution } from '../model/step-execution.model';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Displays a job's execution detail information based on the job execution id that is passed in via params on the URI.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-job-execution-details',
  templateUrl: './job-execution-details.component.html'
})
export class JobExecutionDetailsComponent implements OnInit {

  /**
   * Observable Jobs
   */
  jobExecution$: Observable<JobExecution>;

  /**
   * Constructor
   *
   * @param {JobsService} jobsService
   * @param {NotificationService} notificationService
   * @param {ActivatedRoute} route
   * @param {LoggerService} loggerService
   * @param {RoutingStateService} routingStateService
   * @param {Router} router
   */
  constructor(private jobsService: JobsService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private loggerService: LoggerService,
              private routingStateService: RoutingStateService,
              private router: Router) {

  }

  /**
   * Retrieves the JobExecutionId from the JobService.
   */
  ngOnInit() {
    this.jobExecution$ = this.route.params
      .pipe(
        mergeMap(
          val => this.jobsService.getJobExecution(val.id)
        ),
        catchError((error) => {
          if (HttpAppError.is404(error) || HttpAppError.is400(error)) {
            this.back();
          }
          this.loggerService.log('error while loading Job Execution Details', error);
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );
  }

  /**
   * Navigates to the view step execution page.
   *
   * @param {JobExecution} jobExecution
   * @param {StepExecution} item the id of the StepExecution is used to construct the URI parameters along with the
   * JobExecutionId.
   */
  viewStep(jobExecution: JobExecution, item: StepExecution) {
    this.router.navigate([`jobs/executions/${jobExecution.jobExecutionId}/${item.id}`]);
  }

  back() {
    this.routingStateService.back('/jobs/executions', /^(\/jobs\/executions\/)/);
  }
}
