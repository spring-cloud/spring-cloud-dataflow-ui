import { SharedAppsService } from '../../shared/services/shared-apps.service';
import { ErrorHandler } from '../../shared/model';
import { StreamsService } from '../streams.service';
import { AppsService } from '../../apps/apps.service';
import { AppsWorkaroundService } from '../../apps/apps.workaround.service';
import { StreamDeployService } from './stream-deploy.service';
import { LoggerService } from '../../shared/services/logger.service';
import { of } from 'rxjs';

/**
 * Test Stream Deploy Services.
 *
 * @author Damien Vitrac
 */
describe('StreamDeployService', () => {

  beforeEach(() => {

    this.mockHttpSharedAppsService = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.mockHttpStreamsService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.mockHttpAppsService = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);

    const errorHandler = new ErrorHandler();

    const loggerService = new LoggerService();
    const sharedAppsService = new SharedAppsService(this.mockHttpSharedAppsService, loggerService, errorHandler);
    const workAroundService = new AppsWorkaroundService(sharedAppsService);
    const streamsService = new StreamsService(this.mockHttpStreamsService, loggerService, errorHandler);
    const appsService = new AppsService(this.mockHttpAppsService, errorHandler, loggerService, workAroundService, sharedAppsService);

    this.streamDeployService = new StreamDeployService(streamsService, sharedAppsService, appsService);
  });

  describe('app', () => {

    it('should call the shared apps service with the right url to get a app details', () => {
      const applicationType = 'source';
      const applicationName = 'foo';
      this.mockHttpSharedAppsService.get.and.returnValue(of({
        options: []
      }));
      this.streamDeployService.appDetails(applicationType, applicationName);

      const httpUri = this.mockHttpSharedAppsService.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttpSharedAppsService.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/' + applicationType + '/' + applicationName);
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });

    it('should return an array of options formatted', () => {
      const applicationType = 'source';
      const applicationName = 'foo';
      this.mockHttpSharedAppsService.get.and.returnValue(of({
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
      );
      this.streamDeployService.appDetails(applicationType, applicationName).subscribe((options) => {
        expect(options.length).toBe(1);
        expect(options[0]['valueOptions'].length).toBe(7);
        expect(options[0]['valueOptions'][0]).toBe('NANOSECONDS');
      });
    });

  });

  describe('Clean Value properties', () => {

    it('without change', () => {
      [
        'foo',
        'foo bar',
        'foo " bar',
        '"foo',
        '\'foo',
        'foo\'',
        'foo barr"'
      ].forEach((mock) => {
        expect(this.streamDeployService.cleanValueProperties(mock)).toBe(mock);
      });
    });

    it('with change', () => {
      [
        ['\'foo\'', 'foo'],
        ['\"foo\"', 'foo'],
        ['\"foo bar\"', 'foo bar'],
        ['\"foo \' bar\"', 'foo \' bar'],
        ['\"foo \" bar\"', 'foo \" bar']
      ].forEach((mock) => {
        expect(this.streamDeployService.cleanValueProperties(mock[0])).toBe(mock[1]);
      });
    });

  });

});
