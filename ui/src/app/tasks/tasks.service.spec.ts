import { ErrorHandler } from '../shared/model/error-handler';
import { TasksService } from './tasks.service';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

describe('TasksService', () => {

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {};
    const loggerService = new LoggerService();
    const errorHandler = new ErrorHandler();
    this.tasksService = new TasksService(this.mockHttp, errorHandler, loggerService);
  });

  describe('getDefinition', () => {

    it('should call the definition service with the right url', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.tasksService.getDefinition('foo');
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/tasks/definitions/foo');
    });

  });

  describe('getDefinitions', () => {

    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getDefinitions();
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getDefinitions(undefined);
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getDefinitions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,ASC');
    });

    it('should call the definitions service with the right url [search desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getDefinitions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
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
      this.mockHttp.get.and.returnValue(of({}));
      this.tasksService.getExecution('foo');
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/tasks/executions/foo');
    });

  });

  describe('getExecutions', () => {
    it('should call the executions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getExecutions();
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getExecutions(undefined);
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url (sort, order)', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.tasksService.getExecutions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });


    it('should call the executions service with the right url (search, sort, order)', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.tasksService.getExecutions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('search')).toEqual('foo');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });

    it('should call the executions service with a task in parameter with the right url (name, sort, order)', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.tasksService.getTaskExecutions({ q: 'foo', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('name')).toEqual('foo');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });

    it('should call the executions service with a task in parameter with the right url (default params)', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.tasksService.getTaskExecutions(null);
      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    describe('getSchedule', () => {

      it('should call the schedule service with the right url', () => {
        this.mockHttp.get.and.returnValue(of({}));
        this.tasksService.getSchedule('foo');
        const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules/foo');
      });

    });

    describe('getSchedules', () => {

      it('should call the scheduler with the right url (default params)', () => {
        this.mockHttp.get.and.returnValue(of({}));
        this.tasksService.getSchedules(null);
        const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules');
      });

      it('should call the scheduler with the right url (search)', () => {
        this.mockHttp.get.and.returnValue(of({}));
        this.tasksService.getSchedules({ q: 'foo', page: 0, size: 40, sort: null, order: null });
        const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/schedules/instances/foo');
      });

    });

    describe('createSchedule / destroySchedule', () => {

      it('should call the create schedule with the right url/params', () => {
        this.mockHttp.post.and.returnValue(of({}));
        this.tasksService.createSchedule({ schedulerName: 'foo', task: 'bar', cronExpression: 'foobar', args: '', props: '' });
        const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
        const httpParams = this.mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar');
      });

      it('should call the create schedules with the right url/params', () => {
        this.mockHttp.post.and.returnValue(of({}));
        this.tasksService.createSchedules([
          { schedulerName: 'foo', task: 'bar', cronExpression: 'foobar', args: '', props: '' },
          { schedulerName: 'foo2', task: 'bar2', cronExpression: 'foobar2', args: '', props: '' }
        ]);

        let httpUri = this.mockHttp.post.calls.argsFor(0)[0];
        let httpParams = this.mockHttp.post.calls.argsFor(0)[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar');


        httpUri = this.mockHttp.post.calls.argsFor(1)[0];
        httpParams = this.mockHttp.post.calls.argsFor(1)[2].params;
        expect(httpUri).toEqual('/tasks/schedules');
        expect(httpParams.get('scheduleName')).toEqual('foo2');
        expect(httpParams.get('taskDefinitionName')).toEqual('bar2');
        expect(httpParams.get('arguments')).toEqual('');
        expect(httpParams.get('properties')).toEqual('scheduler.cron.expression=foobar2');
      });

      it('should call the destroy schedule with the right url', () => {
        this.mockHttp.delete.and.returnValue(of({}));
        this.tasksService.destroySchedule({ name: 'foo' });
        const httpUri = this.mockHttp.delete.calls.mostRecent().args[0];
        expect(httpUri).toEqual('/tasks/schedules/foo');
      });

      it('should call the destroy schedules with the right url', () => {
        this.mockHttp.delete.and.returnValue(of({}));
        this.tasksService.destroySchedules([
          { name: 'foo' },
          { name: 'bar' }
        ]);
        let httpUri = this.mockHttp.delete.calls.argsFor(0)[0];
        expect(httpUri).toEqual('/tasks/schedules/foo');
        httpUri = this.mockHttp.delete.calls.argsFor(1)[0];
        expect(httpUri).toEqual('/tasks/schedules/bar');
      });

    });

    describe('createDefinition / destroyDefinition / launchDefinition', () => {

      it('should call the create definition with the right url/params', () => {
        this.mockHttp.post.and.returnValue(of({}));
        this.tasksService.createDefinition({ name: 'foo', definition: 'bar && foobar' });
        const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
        const httpParams = this.mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/definitions');
        expect(httpParams.get('name')).toEqual('foo');
        expect(httpParams.get('definition')).toEqual('bar && foobar');
      });

      it('should call the destroy definition with the right url', () => {
        this.mockHttp.delete.and.returnValue(of({}));
        this.tasksService.destroyDefinition({ name: 'foo' });
        const httpUri = this.mockHttp.delete.calls.mostRecent().args[0];
        expect(httpUri).toEqual('/tasks/definitions/foo');
      });

      it('should call the destroy definition with the right url', () => {
        this.mockHttp.delete.and.returnValue(of({}));
        this.tasksService.destroyDefinitions([
          { name: 'foo' },
          { name: 'bar' }
        ]);
        let httpUri = this.mockHttp.delete.calls.argsFor(0)[0];
        expect(httpUri).toEqual('/tasks/definitions/foo');
        httpUri = this.mockHttp.delete.calls.argsFor(1)[0];
        expect(httpUri).toEqual('/tasks/definitions/bar');
      });

      it('should call the launch definition with the right url/params', () => {
        this.mockHttp.post.and.returnValue(of({}));
        this.tasksService.launchDefinition({ name: 'foo', args: 'a=a', props: 'b=b'});
        const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
        const httpParams = this.mockHttp.post.calls.mostRecent().args[2].params;
        expect(httpUri).toEqual('/tasks/executions');
        expect(httpParams.get('name')).toEqual('foo');
        expect(httpParams.get('arguments')).toEqual('a=a');
        expect(httpParams.get('properties')).toEqual('b=b');
      });

    });

    describe('getPlatforms', () => {

      it('should call the platform service with the right url', () => {
        this.mockHttp.get.and.returnValue(of({}));
        this.tasksService.getPlatforms();
        const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
        expect(httpUri1).toEqual('/tasks/platforms');
      });

    });

  });

});
