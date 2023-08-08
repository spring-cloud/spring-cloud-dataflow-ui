import {TaskService} from './task.service';
import {of} from 'rxjs';
import {Task} from '../model/task.model';
import {TaskExecution} from '../model/task-execution.model';

describe('shared/api/task.service.ts', () => {
  let mockHttp;
  let taskService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put')
    };
    jsonData = {};
    taskService = new TaskService(mockHttp);
  });

  it('getTasks', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    taskService.getTasks(0, 20, 'bar', 'test', 'dslText', 'name', 'DESC');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('sort')).toEqual('name,DESC');
    expect(httpParams.get('taskName')).toEqual('bar');
    expect(httpParams.get('description')).toEqual('test');
    expect(httpParams.get('dslText')).toEqual('dslText');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpUri).toEqual('/tasks/definitions');
  });

  it('getTask', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    taskService.getTask('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/tasks/definitions/foo?manifest=false');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('createTask', () => {
    mockHttp.post.and.returnValue(of({}));
    taskService.createTask('foo', 'bar', 'demo-description');
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/tasks/definitions');
    expect(httpParams.get('name')).toEqual('foo');
    expect(httpParams.get('definition')).toEqual('bar');
    expect(httpParams.get('description')).toEqual('demo-description');
  });

  it('destroyTask', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    taskService.destroyTask(Task.parse({name: 'foo'}));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/definitions/foo');
  });

  it('destroyTasks', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    taskService.destroyTasks([Task.parse({name: 'foo'}), Task.parse({name: 'bar'})]);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/tasks/definitions/foo');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/tasks/definitions/bar');
  });

  it('launch', () => {
    mockHttp.post.and.returnValue(of(jsonData));
    taskService.launch('foo', 'args', 'props');
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/tasks/executions/launch');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('name')).toEqual('foo');
    expect(httpParams.get('arguments')).toEqual('args');
    expect(httpParams.get('properties')).toEqual('props');
  });

  it('executionStop', () => {
    mockHttp.post.and.returnValue(of(jsonData));
    taskService.executionStop(TaskExecution.parse({executionId: 'foo'}));
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/executions/foo');
  });

  it('executionClean', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    taskService.executionClean(TaskExecution.parse({executionId: 'foo'}));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/tasks/executions/foo?action=REMOVE_DATA');
  });

  it('executionsClean', async () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    const taskExecutions = [
      TaskExecution.parse({executionId: 'foo1', schemaTarget: 'boot2'}),
      TaskExecution.parse({executionId: 'foo2', parentExecutionId: 'foo1', schemaTarget: 'boot2'}),
      TaskExecution.parse({executionId: 'foo3', parentExecutionId: 'foo1', schemaTarget: 'boot3'}),
      TaskExecution.parse({executionId: 'bar1', schemaTarget: 'boot3'}),
      TaskExecution.parse({executionId: 'bar2', parentExecutionId: 'bar1', schemaTarget: 'boot2'}),
      TaskExecution.parse({executionId: 'bar3', parentExecutionId: 'bar1', schemaTarget: 'boot3'})
    ];
    await taskService.executionsClean(taskExecutions).toPromise();
    const httpUri = mockHttp.delete.calls.all();
    expect(httpUri).not.toEqual(undefined);
    expect(httpUri).not.toEqual(null);
    expect(httpUri.length).not.toEqual(0);
    expect(httpUri.map(url => url.args[0])).toEqual([
      '/tasks/executions/foo2,bar2?action=CLEANUP,REMOVE_DATA&schemaTarget=boot2',
      '/tasks/executions/foo3,bar3?action=CLEANUP,REMOVE_DATA&schemaTarget=boot3',
      '/tasks/executions/foo1?action=CLEANUP,REMOVE_DATA&schemaTarget=boot2',
      '/tasks/executions/bar1?action=CLEANUP,REMOVE_DATA&schemaTarget=boot3'
    ]);
  });

  it('getExecutions', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    taskService.getExecutions(0, 20, 'bar', 'name', 'DESC');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('sort')).toEqual('name,DESC');
    expect(httpParams.get('name')).toEqual('bar');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpUri).toEqual('/tasks/executions');
  });

  it('getExecution', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    taskService.getExecution(0, 'boot3');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/tasks/executions/0');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getExecutionLogs', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    taskService.getExecutionLogs(
      TaskExecution.parse({
        externalExecutionId: 'foo',
        schemaTarget: 'boot3',
        arguments: [
          '--spring.cloud.data.flow.platformname=bar'
        ]
      })
    );
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/tasks/logs/foo?platformName=bar&schemaTarget=boot3');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getPlatforms', () => {
    mockHttp.get.and.returnValue(of({}));
    taskService.getPlatforms();
    const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri1).toEqual('/tasks/platforms');
  });
});
