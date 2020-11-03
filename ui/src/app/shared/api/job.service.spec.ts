import { JobService } from './job.service';
import { of } from 'rxjs';
import { JobExecution } from '../model/job.model';
import { DateTime } from 'luxon';

describe('shared/api/job.service.ts', () => {

  let mockHttp;
  let jobService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    jobService = new JobService(mockHttp);
  });

  it('getExecutions', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    const date1 = DateTime.fromISO('2020-09-01T10:02:20,600');
    const date2 = DateTime.fromISO('2020-09-02T10:02:20,600');
    jobService.getExecutions(0, 20, date1, date2);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpParams.get('fromDate')).toEqual('2020-09-01T00:00:00,000');
    expect(httpParams.get('toDate')).toEqual('2020-09-02T23:59:59,999');
    expect(httpUri).toEqual('/jobs/thinexecutions');
  });

  it('getExecution', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    jobService.getExecution('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/jobs/executions/foo');
  });

  it('restart', () => {
    mockHttp.put.and.returnValue(of(jsonData));
    jobService.restart(JobExecution.parse({ jobExecution: { id: 'foo' } }));
    const httpUri = mockHttp.put.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/jobs/executions/foo?restart=true');
  });

  it('stop', () => {
    mockHttp.put.and.returnValue(of(jsonData));
    jobService.stop(JobExecution.parse({ jobExecution: { id: 'foo' } }));
    const httpUri = mockHttp.put.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/jobs/executions/foo?stop=true');
  });

  it('getExecutionStep', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    jobService.getExecutionStep('foo', 'bar');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/jobs/executions/foo/steps/bar');
  });

  it('getExecutionStepProgress', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    jobService.getExecutionStepProgress('foo', 'bar');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/jobs/executions/foo/steps/bar/progress');
  });

});
