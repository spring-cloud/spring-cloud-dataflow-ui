import { JobsService } from './jobs.service';
import { HttpUtils } from '../shared/support/http.utils';
import { ErrorHandler } from '../shared/model';
import { LoggerService } from '../shared/services/logger.service';
import { JobExecution } from './model/job-execution.model';
import { of } from 'rxjs';

describe('JobsService', () => {

  beforeEach(() => {

    this.mockHttp = {
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put')
    };

    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    this.jobsService = new JobsService(this.mockHttp, loggerService, errorHandler);
  });

  describe('getJobExecutions', () => {
    it('should call the jobs service with the right url to get all job executions', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));

      expect(this.jobsService.jobExecutions).toBeUndefined();

      const params = HttpUtils.getPaginationParams(0, 10);

      this.jobsService.getJobExecutions({ page: 0, size: 10 });

      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/thinexecutions', { params: params });
    });
  });

  describe('getJobExecution', () => {
    it('should call the jobs service with the right url to get job execution', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.jobsService.getJobExecution('1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1', {});
    });
  });

  describe('getStepExecution', () => {
    it('should call the jobs service with the right url to get step execution', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.jobsService.getStepExecution('1', '1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1', {});
    });
  });

  describe('getStepExecutionProgress', () => {
    it('should call the jobs service with the right url to get step execution progress', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.jobsService.getStepExecutionProgress('1', '1');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1/progress', {});
    });
  });

  describe('restartJobExecution', () => {
    it('should execute a PUT command to restart a job', () => {
      const jobExecution: JobExecution = new JobExecution();
      jobExecution.jobExecutionId = 1;
      jobExecution.name = 'foo';
      this.mockHttp.put.and.returnValue(of(this.jsonData));
      this.jobsService.restartJob(jobExecution);

      const httpUri = this.mockHttp.put.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.put.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/jobs/executions/1?restart=true');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  describe('stopJobExecution', () => {
    it('should execute a PUT command to stop a job', () => {
      const jobExecution: JobExecution = new JobExecution();
      jobExecution.jobExecutionId = 1;
      jobExecution.name = 'foo';

      this.mockHttp.put.and.returnValue(of(this.jsonData));
      this.jobsService.stopJob(jobExecution);

      const httpUri = this.mockHttp.put.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.put.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/jobs/executions/1?stop=true');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

});
