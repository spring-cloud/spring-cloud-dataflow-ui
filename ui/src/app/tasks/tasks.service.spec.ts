import { ErrorHandler } from '../shared/model/error-handler';
import { TasksService } from './tasks.service';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

describe('TasksService', () => {

  let mockHttp;
  let jsonData;
  let tasksService;
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    jsonData = {};
    const loggerService = new LoggerService();
    const errorHandler = new ErrorHandler();
    tasksService = new TasksService(mockHttp, errorHandler, loggerService);
  });

  describe('getDefinition', () => {

    it('should call the definition service with the right url', () => {
      mockHttp.get.and.returnValue(of({}));
      tasksService.getDefinition('foo');
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/tasks/definitions/foo');
    });

  });

  describe('getDefinitions', () => {

    it('should call the definitions service with the right url [no sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getDefinitions();
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getDefinitions(undefined);
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getDefinitions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,ASC');
    });

    it('should call the definitions service with the right url [search desc asc sort]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getDefinitions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('search')).toEqual('foo');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,ASC');
    });

  });

  describe('getExecution', () => {

    it('should call the execution service with the right url', () => {
      mockHttp.get.and.returnValue(of({}));
      tasksService.getExecution('foo');
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/tasks/executions/foo');
    });

  });

  describe('getExecutions', () => {
    it('should call the executions service with the right url [no sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getExecutions();
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url [undefined sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getExecutions(undefined);
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url (sort, order)', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      tasksService.getExecutions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });


    it('should call the executions service with the right url (search, sort, order)', () => {
      mockHttp.get.and.returnValue(of({}));
      tasksService.getExecutions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('search')).toEqual('foo');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });

    it('should call the executions service with a task in parameter with the right url (name, sort, order)', () => {
      mockHttp.get.and.returnValue(of({}));
      tasksService.getTaskExecutions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('name')).toEqual('foo');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });

    it('should call the executions service with a task in parameter with the right url (default params)', () => {
      mockHttp.get.and.returnValue(of({}));
      tasksService.getTaskExecutions(null);
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    describe('getSchedule', () => {

      it('should call the schedule service with the right url', () => {
        mockHttp.get.and.returnValue(of({}));
        tasksService.getSchedule('foo');
        const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules/foo');
      });

    });

    describe('getSchedules', () => {

      it('should call the scheduler with the right url (default params)', () => {
        mockHttp.get.and.returnValue(of({}));
        tasksService.getSchedules(null);
        const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules');
      });

      it('should call the scheduler with the right url (search)', () => {
        mockHttp.get.and.returnValue(of({}));
        tasksService.getSchedules({ q: 'foo', page: 0, size: 40, sort: null, order: null });
        const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules/instances/foo');
      });

    });

    describe('createSchedule / destroySchedule', () => {

      it('should call the create schedule with the right url/params', () => {
        mockHttp.post.and.returnValue(of({}));
        tasksService.createSchedule({ schedulerName: 'foo', task: 'bar', cronExpression: 'foobar', args: '', props: '' });
        const httpUri = mockHttp.post.calls.mostRecent().args[0];
        const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar');
      });

      it('should call the create schedules with the right url/params', () => {
        mockHttp.post.and.returnValue(of({}));
        tasksService.createSchedules([
          { schedulerName: 'foo', task: 'bar', cronExpression: 'foobar', args: '', props: '' },
          { schedulerName: 'foo2', task: 'bar2', cronExpression: 'foobar2', args: '', props: '' }
        ]);

        let httpUri = mockHttp.post.calls.argsFor(0)[0];
        let httpParams = mockHttp.post.calls.argsFor(0)[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar');


        httpUri = mockHttp.post.calls.argsFor(1)[0];
        httpParams = mockHttp.post.calls.argsFor(1)[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo2');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar2');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar2');
      });

      it('should call the destroy schedule with the right url', () => {
        mockHttp.delete.and.returnValue(of({}));
        tasksService.destroySchedule({ name: 'foo' });
        const httpUri = mockHttp.delete.calls.mostRecent().args[0];
        expect(httpUri).toEqual('/tasks/schedules/foo');
      });

      it('should call the destroy schedules with the right url', () => {
        mockHttp.delete.and.returnValue(of({}));
        tasksService.destroySchedules([
          { name: 'foo' },
          { name: 'bar' }
        ]);
        let httpUri = mockHttp.delete.calls.argsFor(0)[0];
        expect(httpUri).toEqual('/tasks/schedules/foo');
        httpUri = mockHttp.delete.calls.argsFor(1)[0];
        expect(httpUri).toEqual('/tasks/schedules/bar');
      });

    });

    describe('createDefinition / destroyDefinition / launchDefinition', () => {

      it('should call the create definition with the right url/params', () => {
        mockHttp.post.and.returnValue(of({}));
        tasksService.createDefinition({ name: 'foo', definition: 'bar && foobar', description: 'demo-description' });
        const httpUri = mockHttp.post.calls.mostRecent().args[0];
        const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/definitions');
        expect(httpParams.get('name')).toEqual('foo');
        expect(httpParams.get('definition')).toEqual('bar && foobar');
        expect(httpParams.get('description')).toEqual('demo-description');
      });

      it('should call the destroy definition with the right url', () => {
        mockHttp.delete.and.returnValue(of({}));
        tasksService.destroyDefinition({ name: 'foo' });
        const httpUri = mockHttp.delete.calls.mostRecent().args[0];
        expect(httpUri).toEqual('/tasks/definitions/foo');
      });

      it('should call the destroy definition with the right url', () => {
        mockHttp.delete.and.returnValue(of({}));
        tasksService.destroyDefinitions([
          { name: 'foo' },
          { name: 'bar' }
        ]);
        let httpUri = mockHttp.delete.calls.argsFor(0)[0];
        expect(httpUri).toEqual('/tasks/definitions/foo');
        httpUri = mockHttp.delete.calls.argsFor(1)[0];
        expect(httpUri).toEqual('/tasks/definitions/bar');
      });

      it('should call the launch definition with the right url/params', () => {
        mockHttp.post.and.returnValue(of({}));
        tasksService.launchDefinition({ name: 'foo', args: 'a=a', props: 'b=b'});
        const httpUri = mockHttp.post.calls.mostRecent().args[0];
        const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/executions');
        expect(httpParams.get('name')).toEqual('foo');
        expect(httpParams.get('arguments')).toEqual('a=a');
        expect(httpParams.get('properties')).toEqual('b=b');
      });

    });

    describe('getPlatforms', () => {

      it('should call the platform service with the right url', () => {
        mockHttp.get.and.returnValue(of({}));
        tasksService.getPlatforms();
        const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/platforms');
      });

    });

  });

});
