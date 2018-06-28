import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JobsService } from '../jobs.service';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { NotificationService } from '../../shared/services/notification.service';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { LoggerService } from '../../shared/services/logger.service';
import { EMPTY } from 'rxjs/index';

/**
 * Step Execution Progress
 *
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-step-execution-progress',
  styleUrls: ['../step-execution-details/styles.scss'],
  templateUrl: './step-execution-progress.component.html'
})
export class StepExecutionProgressComponent implements OnInit {

  /**
   * Observable Step Execution Informations
   */
  stepExecutionDetails$: Observable<any>;

  /**
   * Current Job ID
   */
  jobId: number;

  /**
   * Constructor
   *
   * @param {JobsService} jobsService
   * @param {ActivatedRoute} route
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   * @param {RoutingStateService} routingStateService
   */
  constructor(private jobsService: JobsService,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private routingStateService: RoutingStateService) {
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
        ]).pipe(map((val2) => {
          this.jobId = val.jobid;
          return val2;
        }))
      ))
      .pipe(map(
        val => ({ jobExecution: val[0], stepExecution: val[1], stepExecutionProgress: val[2] })
      )).catch((error) => {
        if (HttpAppError.is404(error) || HttpAppError.is400(error)) {
          this.routingStateService.back(`/jobs/executions/`);
        }
        this.loggerService.log('error while loading Step Execution Progress', error);
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        return EMPTY;
      });
  }

  /**
   * Navigate to the previous page
   */
  back() {
    this.routingStateService.back(`/jobs/executions/${this.jobId}`);
  }

}
