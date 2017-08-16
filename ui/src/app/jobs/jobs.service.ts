import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

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

@Injectable()
export class JobsService {

  private jobExecutionsUrl = '/jobs/executions';
  public jobExecutions: Page<JobExecution>;
  public remotelyLoaded = false;

  constructor(private http: Http, private errorHandler: ErrorHandler) { }

  getJobExecutions(reload?: boolean): Observable<Page<JobExecution>> {
    console.log(`Get Job Executions - reload ${reload}`, this.jobExecutions);
    if (!this.jobExecutions || reload) {
      if (!this.jobExecutions) {
        this.jobExecutions = new Page<JobExecution>();
      }
      console.log('Fetching Job Executions remotely.');
      this.remotelyLoaded = true;

      const params = HttpUtils.getPaginationParams(this.jobExecutions.pageNumber, this.jobExecutions.pageSize);

      return this.http.get(this.jobExecutionsUrl, { search: params })
                    .map(this.extractData.bind(this))
                    .catch(this.errorHandler.handleError);

    } else {
      this.remotelyLoaded = false;
      console.log('Fetching Job Executions from local state.', this.jobExecutions);
      return Observable.of(this.jobExecutions);
    }
  }

  getJobExecution(id: string): Observable<JobExecution> {
    return this.http.get(this.jobExecutionsUrl + '/' + id, {})
      .map(this.extractJobExecutionData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  getStepExecution(jobid: string, stepid: string): Observable<StepExecutionResource> {
    return this.http.get(this.jobExecutionsUrl + '/' + jobid + '/steps/' + stepid, {})
      .map(this.extractStepExecutionData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  private extractStepExecutionData(response: Response): StepExecutionResource {
    const body = response.json();
    const stepExecutionItem = body.stepExecution;
    const stepExecutionResource: StepExecutionResource = new StepExecutionResource();
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
  }

  private extractJobExecutionData(response: Response): JobExecution {
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

    jsonItem.jobExecution.stepExecutions.forEach( stepExecutionItem => {
        const stepExecution = new StepExecution();
        stepExecution.id = stepExecutionItem.id;
        stepExecution.name = stepExecutionItem.stepName;
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
        stepExecution.status = stepExecutionItem.status;
        jobExecution.stepExecutions.push(stepExecution);
      }
    );

    jobExecution.restartable = jsonItem.restartable;
    jobExecution.abandonable = jsonItem.abandonable;
    jobExecution.stoppable = jsonItem.stoppable;
    jobExecution.defined = jsonItem.defined;
    return jobExecution;
  }

  private extractData(response: Response): Page<JobExecution> {
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

    this.jobExecutions.update(page);
    return this.jobExecutions;
  }
}
