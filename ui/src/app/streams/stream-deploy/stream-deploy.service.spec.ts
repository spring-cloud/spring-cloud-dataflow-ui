import {SharedAppsService} from '../../shared/services/shared-apps.service';
import {ErrorHandler} from '../../shared/model';
import {StreamsService} from '../streams.service';
import {AppsService} from '../../apps/apps.service';
import {AppsWorkaroundService} from '../../apps/apps.workaround.service';
import {BusyService} from '../../shared/services/busy.service';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import {StreamDeployService} from './stream-deploy.service';
import {Observable} from 'rxjs/Observable';
import {HttpUtils} from '../../shared/support/http.utils';

/**
 * Test Stream Deploy Services.
 *
 * @author Damien Vitrac
 */
describe('StreamDeployService', () => {

  beforeEach(() => {

    this.mockHttpSharedAboutService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.mockHttpSharedAppsService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.mockHttpStreamsService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.mockHttpAppsService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);

    const errorHandler = new ErrorHandler();

    const sharedAboutService = new SharedAboutService(new BusyService(), this.mockHttpSharedAboutService, errorHandler);
    const sharedAppsService = new SharedAppsService(this.mockHttpSharedAppsService, errorHandler);
    const workAroundService = new AppsWorkaroundService(sharedAppsService);
    const streamsService = new StreamsService(this.mockHttpStreamsService, errorHandler);
    const appsService = new AppsService(this.mockHttpAppsService, errorHandler, workAroundService, sharedAppsService);

    this.streamDeployService = new StreamDeployService(sharedAboutService, streamsService, sharedAppsService, appsService);
  });

  describe('app', () => {

    it('should call the shared apps service with the right url to get a app details', () => {
      const applicationType = 'source';
      const applicationName = 'foo';
      this.mockHttpSharedAppsService.get.and.returnValue(Observable.of({
        options: []
      }));
      this.streamDeployService.app(applicationType, applicationName);
      expect(this.mockHttpSharedAppsService.get).toHaveBeenCalledWith(
        '/apps/' + applicationType + '/' + applicationName, HttpUtils.getDefaultRequestOptions());
    });

    it('should return an array of options formatted', () => {
      const applicationType = 'source';
      const applicationName = 'foo';
      this.mockHttpSharedAppsService.get.and.returnValue(Observable.of({
        json: () => ({
          name: applicationName,
          type: applicationType,
          options: [
            {
              id: 'foo',
              name: 'foo',
              description: 'foo',
              shortDescription: 'foo',
              deprecation: 'foo',
              sourceType: 'foo',
              isDeprecated: false,
              type: 'java.util.concurrent.TimeUnit',
              defaultValue: ''
            }
          ]
        })
      }));
      this.streamDeployService.app(applicationType, applicationName).subscribe((options) => {
        expect(options.length).toBe(1);
        expect(options[0]['valueOptions'].length).toBe(7);
        expect(options[0]['valueOptions'][0]).toBe('NANOSECONDS');
      });
    });

  });

});
