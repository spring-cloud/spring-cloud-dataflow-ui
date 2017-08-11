import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ErrorHandler, Page } from '../shared/model';

import { JobExecution } from './model/job-execution.model';
import { HttpUtils } from '../shared/support/http.utils';

import * as moment from 'moment';

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
