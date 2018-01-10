import { Observable } from 'rxjs/Rx';

import { JobsService } from './jobs.service';
import { HttpUtils } from '../shared/support/http.utils';
import { ErrorHandler } from '../shared/model';
import {
  JOB_EXECUTIONS_WITH_PAGINATION, JOBS_EXECUTIONS, JOBS_EXECUTIONS_1, JOBS_EXECUTIONS_1_STEPS_1,
  JOBS_EXECUTIONS_1_STEPS_1_PROGRESS
} from '../tests/mocks/mock-data';
import {Page} from '../shared/model/page';
import {JobExecution} from './model/job-execution.model';
import {RequestOptionsArgs} from '@angular/http';

export class MockResponse {

  private _body: any;

  get body(): any {
    return this._body;
  }

  set body(value: any) {
    this._body = value;
  }

  public json(): any {
    return this.body;
  }
}

describe('JobsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['get', 'put']);
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    this.jobsService = new JobsService(this.mockHttp, errorHandler);
  });

  describe('getJobExecutions', () => {

    it('should call the jobs service with the right url to get all job executions', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      expect(this.jobsService.jobExecutions).toBeUndefined();

      const params = HttpUtils.getPaginationParams(0, 10);

      this.jobsService.getJobExecutions();

      const defaultPageNumber: number = this.jobsService.jobExecutions.pageNumber;
      const defaultPageSize: number = this.jobsService.jobExecutions.pageSize;

      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(10);

      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions', { search: params });
    });
  });

  describe('getJobExecutionsCached', () => {

    it('should call the jobs service to get all cached job executions', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      this.jobsService.jobExecutions = JOBS_EXECUTIONS;

      const params = HttpUtils.getPaginationParams(0, 10);

      this.jobsService.getJobExecutions(false);

      expect(this.mockHttp.get).not.toHaveBeenCalledWith('/jobs/executions', { search: params });
    });
  });

  describe('getJobExecution', () => {
    it('should call the jobs service with the right url to get job execution', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.jobsService.getJobExecution('1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1', {});
    });
  });

  describe('getStepExecution', () => {
    it('should call the jobs service with the right url to get step execution', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.jobsService.getStepExecution('1', '1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1', {});
    });
  });

  describe('getStepExecutionProgress', () => {
    it('should call the jobs service with the right url to get step execution progress', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.jobsService.getStepExecutionProgress('1', '1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1/progress', {});
    });
  });

  describe('restartJobExecution', () => {
    it('should execute a PUT command to restart a job', () => {
      const jobExecution: JobExecution = new JobExecution();
      jobExecution.jobExecutionId = 1;
      jobExecution.name = 'foo';
      this.mockHttp.put.and.returnValue(Observable.of(this.jsonData));
      this.jobsService.restartJob(jobExecution);
      const options: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      expect(this.mockHttp.put).toHaveBeenCalledWith('/jobs/executions/1?restart=true', options);
    });
  });

  describe('stopJobExecution', () => {
    it('should execute a PUT command to stop a job', () => {
      const jobExecution: JobExecution = new JobExecution();
      jobExecution.jobExecutionId = 1;
      jobExecution.name = 'foo';
      this.mockHttp.put.and.returnValue(Observable.of(this.jsonData));
      this.jobsService.stopJob(jobExecution);
      const options: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      expect(this.mockHttp.put).toHaveBeenCalledWith('/jobs/executions/1?stop=true', options);
    });
  });

  describe('extractData', () => {
    it('should call the jobs service to extract data from json', () => {
      const response = new MockResponse();
      response.body = JOB_EXECUTIONS_WITH_PAGINATION ;
      this.jobsService.jobExecutions = new Page<JobExecution>();
      const jobExecutions = this.jobsService.extractData(response);
      expect(jobExecutions.pageNumber).toBe(0);
      expect(jobExecutions.pageSize).toBe(10);
      expect(jobExecutions.totalElements).toBe(2);
      expect(jobExecutions.totalPages).toBe(1);

      expect(jobExecutions.items[0].name).toBe('job2');
      expect(jobExecutions.items[1].name).toBe('job1');
      expect(jobExecutions.items[0].startTime.toISOString()).toBe('2017-09-06T00:54:46.000Z');
      expect(jobExecutions.items[0].stepExecutionCount).toBe(1);
      expect(jobExecutions.items[0].status).toBe('COMPLETED');
      expect(jobExecutions.items[0].jobExecutionId).toBe(2);
      expect(jobExecutions.items[0].taskExecutionId).toBe(95);
      expect(jobExecutions.items[0].jobInstanceId).toBe(2);
      expect(jobExecutions.items[0].restartable).toBe(false);
      expect(jobExecutions.items[0].abandonable).toBe(false);
      expect(jobExecutions.items[0].stoppable).toBe(false);
      expect(jobExecutions.items[0].defined).toBe(false);

    });
  });

  describe('extractStepExecutionProgressData', () => {
    it('should call the jobs service to parse progress from json', () => {
      const response = new MockResponse();
      response.body = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS ;
      const stepExecutionProgress = this.jobsService.extractStepExecutionProgressData(response);

      expect(stepExecutionProgress.stepExecution.name).toBe('job1step1');
      expect(stepExecutionProgress.stepExecution.executionContext.dirty).toBe(true);
      expect(stepExecutionProgress.percentageComplete).toBe(1);
      expect(stepExecutionProgress.finished).toBe(true);
      expect(stepExecutionProgress.duration).toBe(13);

      expect(stepExecutionProgress.stepExecution.id).toBe(1);
      expect(stepExecutionProgress.stepExecution.status).toBe('COMPLETED');
      expect(stepExecutionProgress.stepExecution.readCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.writeCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.commitCount).toBe(1);
      expect(stepExecutionProgress.stepExecution.writeCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.rollbackCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.readSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.processSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.writeSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.skipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.startTime.toISOString()).toBe('2017-08-21T07:25:05.028Z');
      expect(stepExecutionProgress.stepExecution.endTime.toISOString()).toBe('2017-08-21T07:25:05.041Z');
      expect(stepExecutionProgress.stepExecution.exitCode).toBe('COMPLETED');
      expect(stepExecutionProgress.stepExecution.exitMessage).toBe('');

      expect(stepExecutionProgress.stepExecutionHistory.stepName).toBe('job1step1');
      expect(stepExecutionProgress.stepExecutionHistory.count).toBe(1);

      expect(stepExecutionProgress.stepExecutionHistory.commitCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.min).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.max).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.mean).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.duration.count).toBe( 1);
      expect(stepExecutionProgress.stepExecutionHistory.duration.min).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.max).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.mean).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.count).toBe( 0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.standardDeviation).toBe(0);

    });
  });

  describe('extractStepExecutionData', () => {
    it('should call the jobs service to parse step execution from json', () => {
      const response = new MockResponse();
      response.body = JOBS_EXECUTIONS_1_STEPS_1 ;
      const stepExecutionResource = this.jobsService.extractStepExecutionData(response);

      expect(stepExecutionResource.stepExecution.id).toBe(1);
      expect(stepExecutionResource.stepExecution.name).toBe('job1step1');
      expect(stepExecutionResource.stepExecution.executionContext.dirty).toBe(true);
      expect(stepExecutionResource.stepExecution.status).toBe('COMPLETED');
      expect(stepExecutionResource.stepExecution.readCount).toBe(0);
      expect(stepExecutionResource.stepExecution.writeCount).toBe(0);
      expect(stepExecutionResource.stepExecution.commitCount).toBe(1);
      expect(stepExecutionResource.stepExecution.rollbackCount).toBe(0);
      expect(stepExecutionResource.stepExecution.readSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.processSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.writeSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.filterCount).toBe(0);
      expect(stepExecutionResource.stepExecution.skipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.startTime.toISOString()).toBe('2017-08-11T06:15:50.046Z');
      expect(stepExecutionResource.stepExecution.endTime.toISOString()).toBe('2017-08-11T06:15:50.064Z');
    });
  });

  describe('extractJobExecutionData', () => {
    it('should call the jobs service to parse job execution from json', () => {
      const response = new MockResponse();
      response.body = JOBS_EXECUTIONS_1;
      const jobExecution = this.jobsService.extractJobExecutionData(response);

      expect(jobExecution.name).toBe('job1');
      expect(jobExecution.startTime.toISOString()).toBe('2017-08-11T06:15:50.027Z');
      expect(jobExecution.endTime.toISOString()).toBe('2017-08-11T06:15:50.067Z');
      expect(jobExecution.stepExecutionCount).toBe(1);
      expect(jobExecution.status).toBe('COMPLETED');
      expect(jobExecution.exitCode).toBe('COMPLETED');
      expect(jobExecution.exitMessage).toBe('');
      expect(jobExecution.jobExecutionId).toBe(1);
      expect(jobExecution.taskExecutionId).toBe(2);
      expect(jobExecution.jobInstanceId).toBe(1);
      expect(jobExecution.jobParametersString).toBe('--spring.cloud.task.executionid=2');
      expect(jobExecution.restartable).toBe(false);
      expect(jobExecution.abandonable).toBe(false);
      expect(jobExecution.stoppable).toBe(false);
      expect(jobExecution.defined).toBe(true);

      expect(jobExecution.stepExecutions[0].id).toBe(1);
      expect(jobExecution.stepExecutions[0].name).toBe('job1step1');
      expect(jobExecution.stepExecutions[0].readCount).toBe(0);
      expect(jobExecution.stepExecutions[0].writeCount).toBe(0);
      expect(jobExecution.stepExecutions[0].commitCount).toBe(1);
      expect(jobExecution.stepExecutions[0].rollbackCount).toBe(0);
      expect(jobExecution.stepExecutions[0].readSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].processSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].writeSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].filterCount).toBe(0);
      expect(jobExecution.stepExecutions[0].skipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].startTime.toISOString()).toBe('2017-08-11T06:15:50.046Z');
      expect(jobExecution.stepExecutions[0].endTime.toISOString()).toBe('2017-08-11T06:15:50.064Z');
      expect(jobExecution.stepExecutions[0].status).toBe('COMPLETED');
    });
  });

});
