import { JobsService } from './jobs.service';
import { HttpUtils } from '../shared/support/http.utils';
import { ErrorHandler } from '../shared/model';
import { LoggerService } from '../shared/services/logger.service';
import { JobExecution } from './model/job-execution.model';
import { of } from 'rxjs';

describe('JobsService', () => {

  let mockHttp;
  let jsonData;
  let jobsService;
  beforeEach(() => {

    mockHttp = {
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put')
    };

    jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    jobsService = new JobsService(mockHttp, loggerService, errorHandler);
  });

  describe('getJobExecutions', () => {
    it('should call the jobs service with the right url to get all job executions', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      expect(jobsService.jobExecutions).toBeUndefined();

      const params = HttpUtils.getPaginationParams(0, 10);

      jobsService.getJobExecutions({ page: 0, size: 10 });

      expect(mockHttp.get).toHaveBeenCalledWith('/jobs/thinexecutions', { params: params });
    });
  });

  describe('getJobExecution', () => {
    it('should call the jobs service with the right url to get job execution', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      jobsService.getJobExecution('1');
      expect(mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1', {});
    });
  });

  describe('getStepExecution', () => {
    it('should call the jobs service with the right url to get step execution', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      jobsService.getStepExecution('1', '1');
      expect(mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1', {});
    });
  });

  describe('getStepExecutionProgress', () => {
    it('should call the jobs service with the right url to get step execution progress', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      jobsService.getStepExecutionProgress('1', '1');
      expect(mockHttp.get).toHaveBeenCalledWith('/jobs/executions/1/steps/1/progress', {});
    });
  });

  describe('restartJobExecution', () => {
    it('should execute a PUT command to restart a job', () => {
      const jobExecution: JobExecution = new JobExecution();
      jobExecution.jobExecutionId = 1;
      jobExecution.name = 'foo';
      mockHttp.put.and.returnValue(of(jsonData));
      jobsService.restartJob(jobExecution);

      const httpUri = mockHttp.put.calls.mostRecent().args[0];
      const headerArgs = mockHttp.put.calls.mostRecent().args[1].headers;
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

      mockHttp.put.and.returnValue(of(jsonData));
      jobsService.stopJob(jobExecution);

      const httpUri = mockHttp.put.calls.mostRecent().args[0];
      const headerArgs = mockHttp.put.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/jobs/executions/1?stop=true');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

});
