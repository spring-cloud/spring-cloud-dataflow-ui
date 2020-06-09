import { of } from 'rxjs';
import { ScheduleService } from './schedule.service';

describe('shared/api/schedule.service.ts', () => {
  let mockHttp;
  let scheduleService;
  let jsonData = {};

  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    scheduleService = new ScheduleService(mockHttp);
  });

  it('getSchedules', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    scheduleService.getSchedules('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/instances/foo');
  });

  it('getSchedule', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    scheduleService.getSchedule('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/foo');
  });

  it('createSchedule', () => {
    mockHttp.post.and.returnValue(of({}));
    scheduleService.createSchedule('foo', 'bar', 'cron', 'args', 'props');
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar');
    expect(httpParams.get('arguments')).toEqual('args');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron,props');
  });

  it('createSchedules', () => {
    mockHttp.post.and.returnValue(of({}));
    scheduleService.createSchedules([
      { schedulerName: 'foo', task: 'bar', cronExpression: 'cron', args: 'args', props: 'props' },
      { schedulerName: 'foo1', task: 'bar1', cronExpression: 'cron1', args: 'args1', props: 'props1' },
    ]);

    let httpUri = mockHttp.post.calls.argsFor(0)[0];
    let httpParams = mockHttp.post.calls.argsFor(0)[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar');
    expect(httpParams.get('arguments')).toEqual('args');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron,props');

    httpUri = mockHttp.post.calls.argsFor(1)[0];
    httpParams = mockHttp.post.calls.argsFor(1)[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo1');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar1');
    expect(httpParams.get('arguments')).toEqual('args1');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron1,props1');
  });

  it('destroySchedule', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    scheduleService.destroySchedule('foo');
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/foo');
  });

  it('destroySchedules', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    scheduleService.destroySchedules(['foo', 'bar']);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/tasks/schedules/foo');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/tasks/schedules/bar');
  });

});
