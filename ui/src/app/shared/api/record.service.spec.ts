import { of } from 'rxjs';
import { RecordService } from './record.service';
import { DateTime } from 'luxon';
import { GET_ACTION_TYPES, GET_OPERATION_TYPES } from '../../tests/data/record';

describe('shared/api/record.service.ts', () => {
  let mockHttp;
  let recordService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    recordService = new RecordService(mockHttp);
  });

  it('getRecords', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    const date = DateTime.local();
    recordService.getRecords(0, 20, 'foo', 'action', 'operation', date, date, 'name', 'DESC');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('sort')).toEqual('name,DESC');
    expect(httpParams.get('search')).toEqual('foo');
    expect(httpParams.get('actions')).toEqual('action');
    expect(httpParams.get('operations')).toEqual('operation');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpUri).toEqual('/audit-records');
  });

  it('getOperationTypes', async (done) => {
    mockHttp.get.and.returnValue(of([
      { 'id': 100, 'name': 'App Registration', 'key': 'APP_REGISTRATION' },
      { 'id': 200, 'name': 'Schedule', 'key': 'SCHEDULE' },
      { 'id': 300, 'name': 'Stream', 'key': 'STREAM' },
      { 'id': 400, 'name': 'Task', 'key': 'TASK' }
    ]));
    await recordService.getOperationTypes().subscribe();
    await recordService.getOperationTypes().subscribe();
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(mockHttp.get.calls.all().length).toBe(1);
    expect(httpUri).toEqual('/audit-records/audit-operation-types');
    done();
  });

  it('getOperationTypes', async (done) => {
    mockHttp.get.and.returnValue(of(GET_OPERATION_TYPES));
    await recordService.getOperationTypes().subscribe();
    await recordService.getOperationTypes().subscribe();
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(mockHttp.get.calls.all().length).toBe(1);
    expect(httpUri).toEqual('/audit-records/audit-operation-types');
    done();
  });

  it('getOperationTypes', async (done) => {
    mockHttp.get.and.returnValue(of(GET_ACTION_TYPES));
    await recordService.getActionTypes().subscribe();
    await recordService.getActionTypes().subscribe();
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    expect(mockHttp.get.calls.all().length).toBe(1);
    expect(httpUri).toEqual('/audit-records/audit-action-types');
    done();
  });

});
