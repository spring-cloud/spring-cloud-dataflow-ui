import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JobsService } from '../jobs.service';
import { StepExecutionResource } from '../model/step-execution-resource.model';
import { Observable } from 'rxjs/Observable';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpAppError, AppError } from '../../shared/model/error.model';
import { LoggerService } from '../../shared/services/logger.service';
import { NotificationService } from '../../shared/services/notification.service';
import { RoutingStateService } from '../../shared/services/routing-state.service';

/**
 * Step Execution Details
 *
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-step-execution-details',
  styleUrls: ['styles.scss'],
  templateUrl: './step-execution-details.component.html'
})
export class StepExecutionDetailsComponent implements OnInit {

  /**
   * Observable Step Execution Informations
   */
  stepExecutionDetails$: Observable<any>;

  /**
   * Job ID
   */
  jobId: number;

  /**
   * Constructor
   *
   * @param {JobsService} jobsService
   * @param {ActivatedRoute} route
   * @param {LoggerService} loggerService
   * @param {RoutingStateService} routingStateService
   * @param {NotificationService} notificationService
   * @param {Router} router
   */
  constructor(private jobsService: JobsService,
              private route: ActivatedRoute,
              private loggerService: LoggerService,
              private routingStateService: RoutingStateService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  /**
   * Init component
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   */
  refresh() {
    this.stepExecutionDetails$ = this.route.params
      .pipe(mergeMap(
        val => forkJoin([
          this.jobsService.getJobExecution(val.jobid),
          this.jobsService.getStepExecution(val.jobid, val.stepid),
          this.jobsService.getStepExecutionProgress(val.jobid, val.stepid)
        ]),
        (val1: Params, val2: any) => {
          this.jobId = val1.jobid;
          return val2;
        }
      ))
      .pipe(map(
        val => ({ jobExecution: val[0], stepExecution: val[1], stepExecutionProgress: val[2] })
      )).catch((error) => {
        if (HttpAppError.is404(error) || HttpAppError.is400(error)) {
          this.routingStateService.back(`/jobs/executions/`);
        }
        this.loggerService.log('error while loading Step Execution Progress', error);
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        return Observable.throw(error);
      });
  }

  /**
   * Navigates to the step execution progress page.
   *
   * @param {StepExecutionResource} item the id of the StepExecution is used to construct the URI parameters along
   * with the JobExecutionId.
   */
  viewStepExecutionProgress(item: StepExecutionResource) {
    this.router.navigate([`jobs/executions/${item.jobExecutionId}/${item.stepExecution.id}/progress`]);
  }

  /**
   * Navigate to the previous page
   */
  back() {
    this.routingStateService.back(`jobs/executions/${this.jobId}`);
  }

}
