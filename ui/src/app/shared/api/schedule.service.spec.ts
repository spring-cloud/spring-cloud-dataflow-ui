import { of } from 'rxjs';
import { ScheduleService } from './schedule.service';
import { TaskService } from './task.service';

describe('shared/api/schedule.service.ts', () => {
  let mockHttp;
  let scheduleService;
  let taskService;
  let jsonData = {};

  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    taskService = new TaskService(mockHttp);
    scheduleService = new ScheduleService(mockHttp, taskService);
  });

  it('getSchedules', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    scheduleService.getSchedules('foo', 'bar');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/instances/foo?platform=bar');
  });

  it('getSchedule', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    scheduleService.getSchedule('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/foo');
  });

  it('createSchedule', () => {
    mockHttp.post.and.returnValue(of({}));
    scheduleService.createSchedule('foo', 'bar', 'foobar', 'cron', 'args', 'props');
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar');
    expect(httpParams.get('arguments')).toEqual('args');
    expect(httpParams.get('platform')).toEqual('foobar');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron,props');
  });

  it('createSchedules', () => {
    mockHttp.post.and.returnValue(of({}));
    scheduleService.createSchedules([
      { schedulerName: 'foo', task: 'bar', platform: 'foobar1', cronExpression: 'cron', args: 'args', props: 'props' },
      {
        schedulerName: 'foo1', task: 'bar1', platform: 'foobar2', cronExpression: 'cron1',
        args: 'args1', props: 'props1'
      },
    ]);

    let httpUri = mockHttp.post.calls.argsFor(0)[0];
    let httpParams = mockHttp.post.calls.argsFor(0)[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar');
    expect(httpParams.get('arguments')).toEqual('args');
    expect(httpParams.get('platform')).toEqual('foobar1');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron,props');

    httpUri = mockHttp.post.calls.argsFor(1)[0];
    httpParams = mockHttp.post.calls.argsFor(1)[2].params;
    expect(httpUri).toEqual('/tasks/schedules');
    expect(httpParams.get('scheduleName')).toEqual('foo1');
    expect(httpParams.get('taskDefinitionName')).toEqual('bar1');
    expect(httpParams.get('arguments')).toEqual('args1');
    expect(httpParams.get('platform')).toEqual('foobar2');
    expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=cron1,props1');
  });

  it('destroySchedule', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    scheduleService.destroySchedule('foo', 'bar');
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/schedules/foo?platform=bar');
  });

  it('destroySchedules', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    scheduleService.destroySchedules([{ name: 'foo', platform: 'bar' }, { name: 'foo1', platform: 'bar1' }]);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/tasks/schedules/foo?platform=bar');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/tasks/schedules/foo1?platform=bar1');
  });

});
