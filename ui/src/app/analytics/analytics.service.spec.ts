import { MockToastyService } from '../tests/mocks/toasty';
import { ErrorHandler } from '../shared/model/error-handler';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {

  const errorHandler = new ErrorHandler();
  const toastyService = new MockToastyService();

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    this.jsonData = { };
    this.analyticsService = new AnalyticsService(this.mockHttp, errorHandler, toastyService);
  });

  describe('counterInterval', () => {
    it('default interval is set', () => {
      expect(this.analyticsService._counterInterval).toBe(2);
    });

    it('interval change is correctly set', () => {
      this.analyticsService.counterInterval = 1;
      expect(this.analyticsService._counterInterval).toBe(1);
    });

    it('zero interval stops polling', () => {
      const spy = spyOn(this.analyticsService, 'stopPollingForCounters');

      this.analyticsService.counterInterval = 0;
      // interval is not set below 1 but spy that polling stops
      expect(this.analyticsService._counterInterval).toBe(2);
      expect(spy.calls.count()).toBe(1);
    });
  });

});
