import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { JobsService } from './jobs.service';
import { HttpUtils } from '../shared/support/http.utils';
import { ApplicationType, AppRegistration, ErrorHandler } from '../shared/model';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { JobExecution } from './model/job-execution.model';

describe('JobsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
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
});
