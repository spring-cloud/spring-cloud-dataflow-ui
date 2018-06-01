import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ErrorHandler, Page } from '../shared/model';

import { JobExecution } from './model/job-execution.model';
import { StepExecution } from './model/step-execution.model';
import { HttpUtils } from '../shared/support/http.utils';

import * as moment from 'moment';
import { ExecutionContext } from './model/execution-context.model';
import { StepExecutionResource } from './model/step-execution-resource.model';
import { CountDetails, StepExecutionHistory, StepExecutionProgress } from './model/step-execution-progress.model';
import { ListParams } from '../shared/components/shared.interface';

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
    EXECUTIONS: '/jobs/executions'
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
   * @param {Http} http
   * @param {ErrorHandler} errorHandler
   */
  constructor(private http: Http,
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
    console.log(`Get Job Executions`, listParams);
    const params = HttpUtils.getPaginationParams(listParams.page, listParams.size);
    return this.http.get(JobsService.URL.EXECUTIONS, { search: params })
      .map((response) => {
        const body = response.json();
        const items: JobExecution[] = [];
        if (body._embedded && body._embedded.jobExecutionResourceList) {
          for (const jsonItem of body._embedded.jobExecutionResourceList) {
            const jobExecution: JobExecution = new JobExecution();
            jobExecution.name = jsonItem.name;
            jobExecution.startTime = moment(jsonItem.jobExecution.startTime);
            jobExecution.stepExecutionCount = jsonItem.stepExecutionCount;
            jobExecution.status = jsonItem.jobExecution.status;
            jobExecution.jobExecutionId = jsonItem.jobExecution.id;
            jobExecution.taskExecutionId = jsonItem.taskExecutionId;
            jobExecution.jobInstanceId = jsonItem.jobExecution.jobInstance.id;
            jobExecution.restartable = jsonItem.restartable;
            jobExecution.abandonable = jsonItem.abandonable;
            jobExecution.stoppable = jsonItem.stoppable;
            jobExecution.defined = jsonItem.defined;
            items.push(jobExecution);
          }
        }
        const page = new Page<JobExecution>();
        page.items = items;
        page.totalElements = body.page.totalElements;
        page.pageNumber = body.page.number;
        page.pageSize = body.page.size;
        page.totalPages = body.page.totalPages;
        return page;
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieve detail information about a specific job execution.
   *
   * @param {string} id The job execution id of the job that needs to be retrieved.
   * @returns {Observable<JobExecution>}
   */
  getJobExecution(id: string): Observable<JobExecution> {
    return this.http.get(JobsService.URL.EXECUTIONS + '/' + id, {})
      .map((response) => {
        const jsonItem = response.json();
        const jobExecution: JobExecution = new JobExecution();
        jobExecution.name = jsonItem.name;
        jobExecution.startTime = moment(jsonItem.jobExecution.startTime);
        jobExecution.endTime = moment(jsonItem.jobExecution.endTime);
        jobExecution.stepExecutionCount = jsonItem.stepExecutionCount;
        jobExecution.status = jsonItem.jobExecution.status;
        jobExecution.exitCode = jsonItem.jobExecution.exitStatus.exitCode;
        jobExecution.exitMessage = jsonItem.jobExecution.exitStatus.exitDescription;
        jobExecution.jobExecutionId = jsonItem.jobExecution.id;
        jobExecution.taskExecutionId = jsonItem.taskExecutionId;
        jobExecution.jobInstanceId = jsonItem.jobExecution.jobInstance.id;
        jobExecution.jobParametersString = jsonItem.jobParametersString;
        jsonItem.jobExecution.stepExecutions.forEach(stepExecutionItem => {
            jobExecution.stepExecutions.push(this.createStepExecution(stepExecutionItem));
          }
        );
        jobExecution.restartable = jsonItem.restartable;
        jobExecution.abandonable = jsonItem.abandonable;
        jobExecution.stoppable = jsonItem.stoppable;
        jobExecution.defined = jsonItem.defined;
        return jobExecution;
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieve detail information about a specific step execution.
   *
   * @param {string} jobid The job execution id for the step.
   * @param {string} stepid The step execution id.
   * @returns {Observable<StepExecutionResource>}
   */
  getStepExecution(jobid: string, stepid: string): Observable<StepExecutionResource> {
    return this.http.get(JobsService.URL.EXECUTIONS + '/' + jobid + '/steps/' + stepid, {})
      .map((response) => {
        const body = response.json();
        const stepExecutionItem = body.stepExecution;
        const stepExecutionResource: StepExecutionResource = new StepExecutionResource();
        const stepExecution = this.createStepExecution(stepExecutionItem);
        const values = new Array<Map<string, string>>();
        stepExecutionItem.executionContext.values.forEach(item => {
          const map = new Map<string, string>();
          for (const prop in item) {
            if (item.hasOwnProperty(prop)) {
              map.set(prop, item[prop]);
            }
          }
          values.push(map);
        });
        stepExecution.executionContext = new ExecutionContext(
          stepExecutionItem.executionContext.dirty,
          stepExecutionItem.executionContext.empty,
          values);
        stepExecution.exitCode = stepExecutionItem.exitStatus.exitCode;
        stepExecution.exitMessage = stepExecutionItem.exitStatus.exitDescription;
        stepExecutionResource.jobExecutionId = body.jobExecutionId;
        stepExecutionResource.stepExecution = stepExecution;
        stepExecutionResource.stepType = body.stepType;
        return stepExecutionResource;
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieve detail information about a specific step execution progress.
   *
   * @param {string} jobid The job execution id for the step.
   * @param {string} stepid The step execution id.
   * @returns {Observable<StepExecutionProgress>}
   */
  getStepExecutionProgress(jobid: string, stepid: string): Observable<StepExecutionProgress> {
    return this.http.get(JobsService.URL.EXECUTIONS + '/' + jobid + '/steps/' + stepid + '/progress', {})
      .map((response) => {
        const stepExecutionProgress: StepExecutionProgress = new StepExecutionProgress();
        const body = response.json();
        stepExecutionProgress.percentageComplete = body.percentageComplete;
        stepExecutionProgress.finished = body.finished;
        stepExecutionProgress.duration = body.duration;
        const stepExecutionItem = body.stepExecution;
        const stepExecution = this.createStepExecution(stepExecutionItem);
        const values = new Array<Map<string, string>>();
        stepExecutionItem.executionContext.values.forEach(item => {
          const map = new Map<string, string>();
          for (const prop in item) {
            if (item.hasOwnProperty(prop)) {
              map.set(prop, item[prop]);
            }
          }
          values.push(map);
        });
        stepExecution.executionContext = new ExecutionContext(
          stepExecutionItem.executionContext.dirty,
          stepExecutionItem.executionContext.empty,
          values);
        stepExecution.exitCode = stepExecutionItem.exitStatus.exitCode;
        stepExecution.exitMessage = stepExecutionItem.exitStatus.exitDescription;
        stepExecutionProgress.stepExecution = stepExecution;
        const stepExecutionHistory: StepExecutionHistory = new StepExecutionHistory();
        stepExecutionHistory.stepName = body.stepExecutionHistory.stepName;
        stepExecutionHistory.count = body.stepExecutionHistory.count;
        ['commitCount', 'rollbackCount', 'readCount', 'writeCount', 'filterCount', 'readSkipCount', 'writeSkipCount',
          'processSkipCount', 'duration', 'durationPerRead'].forEach((item) => {
          stepExecutionHistory[item] = new CountDetails();
          stepExecutionHistory[item].count = body.stepExecutionHistory[item].count;
          stepExecutionHistory[item].min = body.stepExecutionHistory[item].min;
          stepExecutionHistory[item].max = body.stepExecutionHistory[item].max;
          stepExecutionHistory[item].mean = body.stepExecutionHistory[item].mean;
          stepExecutionHistory[item].standardDeviation = body.stepExecutionHistory[item].standardDeviation;
        });
        stepExecutionProgress.stepExecutionHistory = stepExecutionHistory;
        return stepExecutionProgress;
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Create an instance of StepExecution
   *
   * @param stepExecutionItem JSON data
   * @returns {StepExecution}
   */
  private createStepExecution(stepExecutionItem: any): StepExecution {
    const stepExecution: StepExecution = new StepExecution();
    stepExecution.id = stepExecutionItem.id;
    stepExecution.name = stepExecutionItem.stepName;
    stepExecution.status = stepExecutionItem.status;
    stepExecution.readCount = stepExecutionItem.readCount;
    stepExecution.writeCount = stepExecutionItem.writeCount;
    stepExecution.commitCount = stepExecutionItem.commitCount;
    stepExecution.rollbackCount = stepExecutionItem.rollbackCount;
    stepExecution.readSkipCount = stepExecutionItem.readSkipCount;
    stepExecution.processSkipCount = stepExecutionItem.processSkipCount;
    stepExecution.writeSkipCount = stepExecutionItem.writeSkipCount;
    stepExecution.filterCount = stepExecutionItem.filterCount;
    stepExecution.skipCount = stepExecutionItem.skipCount;
    stepExecution.startTime = moment.utc(stepExecutionItem.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    stepExecution.endTime = moment.utc(stepExecutionItem.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    return stepExecution;
  }

  /**
   * Restarts a job if the job failed.
   *
   * @param {JobExecution} item JobExecution to restart.
   * @returns {Observable<any | any>} with the state of the restart.
   */
  restartJob(item: JobExecution) {
    const options: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
    return this.http.put(JobsService.URL.EXECUTIONS + '/' + item.jobExecutionId + '?restart=true', options)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Stops a running JobExecution.
   *
   * @param {JobExecution} item the JobExecution to stop
   * @returns {Observable<any | any>} state of the job execution stop event.
   */
  stopJob(item: JobExecution) {
    const options: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
    return this.http.put(JobsService.URL.EXECUTIONS + '/' + item.jobExecutionId + '?stop=true', options)
      .catch(this.errorHandler.handleError);
  }
}
