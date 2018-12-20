import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandler, Page } from '../shared/model';
import { JobExecution } from './model/job-execution.model';
import { HttpUtils } from '../shared/support/http.utils';
import { StepExecutionResource } from './model/step-execution-resource.model';
import { StepExecutionProgress } from './model/step-execution-progress.model';
import { LoggerService } from '../shared/services/logger.service';
import { ListParams } from '../shared/components/shared.interface';
import { catchError, map } from 'rxjs/operators';

/**
 * Retrieves Job and Step Execution data from the Spring Cloud Data Flow server.
 *
 * @author Janne Valkealahti
 * @author Damien Vitrac
 */
@Injectable()
export class JobsService {

  /**
   * URL API
   */
  public static URL = {
    EXECUTIONS: '/jobs/executions',
    THINEXECUTIONS: '/jobs/thinexecutions'
  };

  /**
   * Store the state of the applications list params
   */
  jobsContext = {
    sort: 'name',
    order: 'ASC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  /**
   * Constructor
   *
   * @param {HttpClient} httpClient
   * @param {LoggerService} loggerService
   * @param {ErrorHandler} errorHandler
   */
  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Retrieve a paginated list of job executions from the Spring Cloud DataFlow server.
   * wish to retrieve a list of cached job executions from the local state.
   *
   * @param listParams Params (page, size)
   * @returns {Observable<Page<JobExecution>>}
   */
  getJobExecutions(listParams: ListParams): Observable<Page<JobExecution>> {
    this.loggerService.log(`Get Job Executions`, listParams);
    const params = HttpUtils.getPaginationParams(listParams.page, listParams.size);
    return this.httpClient
      .get<any>(JobsService.URL.THINEXECUTIONS, { params: params })
      .pipe(
        map(JobExecution.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Retrieve detail information about a specific job execution.
   *
   * @param {string} id The job execution id of the job that needs to be retrieved.
   * @returns {Observable<JobExecution>}
   */
  getJobExecution(id: string): Observable<JobExecution> {
    return this.httpClient
      .get<any>(JobsService.URL.EXECUTIONS + '/' + id, {})
      .pipe(
        map(JobExecution.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Retrieve detail information about a specific step execution.
   *
   * @param {string} jobid The job execution id for the step.
   * @param {string} stepid The step execution id.
   * @returns {Observable<StepExecutionResource>}
   */
  getStepExecution(jobid: string, stepid: string): Observable<StepExecutionResource> {
    return this.httpClient
      .get<any>(JobsService.URL.EXECUTIONS + '/' + jobid + '/steps/' + stepid, {})
      .pipe(
        map(StepExecutionResource.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Retrieve detail information about a specific step execution progress.
   *
   * @param {string} jobid The job execution id for the step.
   * @param {string} stepid The step execution id.
   * @returns {Observable<StepExecutionProgress>}
   */
  getStepExecutionProgress(jobid: string, stepid: string): Observable<StepExecutionProgress> {
    return this.httpClient
      .get<any>(JobsService.URL.EXECUTIONS + '/' + jobid + '/steps/' + stepid + '/progress', {})
      .pipe(
        map(StepExecutionProgress.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Restarts a job if the job failed.
   *
   * @param {JobExecution} item JobExecution to restart.
   * @returns {Observable<any | any>} with the state of the restart.
   */
  restartJob(item: JobExecution) {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(JobsService.URL.EXECUTIONS + '/' + item.jobExecutionId + '?restart=true', { headers: httpHeaders })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Stops a running JobExecution.
   *
   * @param {JobExecution} item the JobExecution to stop
   * @returns {Observable<any | any>} state of the job execution stop event.
   */
  stopJob(item: JobExecution) {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(JobsService.URL.EXECUTIONS + '/' + item.jobExecutionId + '?stop=true', { headers: httpHeaders })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

}
