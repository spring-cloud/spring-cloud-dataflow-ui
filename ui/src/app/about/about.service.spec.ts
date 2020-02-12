import { AboutService } from './about.service';
import { ErrorHandler } from '../shared/model/error-handler';
import { SharedAboutService } from '../shared/services/shared-about.service';
import { of } from 'rxjs';

describe('AboutService', () => {

  let mockHttp;
  let sharedAboutService;
  let aboutService;

  const jsonData = {
    'featureInfo':
      {
        'streamsEnabled': true,
        'tasksEnabled': true,
      },
    'versionInfo':
      {
        'implementation':
          {
            'name': 'spring-cloud-dataflow-server-local',
            'version': '1.2.3.BUILD-SNAPSHOT',
            'checksumSha1': 'checksumSample1',
            'checksumSha256': 'checksumSample256'
          },
        'core':
          {
            'name': 'Spring Cloud Data Flow Core',
            'version': '1.2.3.BUILD-SNAPSHOT',
            'checksumSha1': 'checksumSample1',
            'checksumSha256': 'checksumSample256'
          },
        'dashboard':
          {
            'name': 'Spring Cloud Dataflow UI',
            'version': '1.2.3.RELEASE',
            'checksumSha1': 'checksumSample1',
            'checksumSha256': 'checksumSample256'
          },
        'shell':
          {
            'name': 'Spring Cloud Dataflow Shell',
            'version': '1.2.3.RELEASE',
            'checksumSha1': 'checksumSample1',
            'checksumSha256': 'checksumSample256'
          }
      },
    'securityInfo':
      {
        'authenticationEnabled': false,
        'authenticated': false,
        'username': null,
        'roles':
          []
      },
    'runtimeEnvironment':
      {
        'appDeployer':
          {
            'deployerImplementationVersion': '1.2.2.BUILD-SNAPSHOT',
            'deployerName': 'LocalAppDeployer',
            'deployerSpiVersion': '1.2.1.RELEASE',
            'javaVersion': '1.8.0_60',
            'platformApiVersion': 'Mac OS X 10.11.6',
            'platformClientVersion': '10.11.6',
            'platformHostVersion': '10.11.6',
            'platformSpecificInfo':
              {},
            'platformType': 'Local',
            'springBootVersion': '1.5.4.RELEASE',
            'springVersion': '4.3.9.RELEASE'
          },
        'taskLaunchers':
          [{
            'deployerImplementationVersion': '1.2.2.BUILD-SNAPSHOT',
            'deployerName': 'LocalTaskLauncher',
            'deployerSpiVersion': '1.2.1.RELEASE',
            'javaVersion': '1.8.0_60',
            'platformApiVersion': 'Mac OS X 10.11.6',
            'platformClientVersion': '10.11.6',
            'platformHostVersion': '10.11.6',
            'platformSpecificInfo':
              {},
            'platformType': 'Local',
            'springBootVersion': '1.5.4.RELEASE',
            'springVersion': '4.3.9.RELEASE'
          }]
      },
    '_links':
      {
        'self':
          {
            'href': 'http://localhost:9393/about'
          }
      }
  };

  beforeEach(() => {
    mockHttp = {
      get: jasmine.createSpy('get'),
    };
    mockHttp.get.and.returnValue(of(jsonData));
    const errorHandler = new ErrorHandler();
    sharedAboutService = new SharedAboutService(mockHttp, errorHandler);
    aboutService = new AboutService(sharedAboutService);
  });

  it('should call the about service with the right url', () => {
    aboutService.getAboutInfo(true);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1];
    expect(httpUri).toEqual('/about');
    expect(headerArgs).toBeUndefined();
  });

  it('should return the correct json data', () => {
    aboutService.getAboutInfo().toPromise().then(result => {
        expect(JSON.stringify(result)).toBe(JSON.stringify(jsonData));
      },
      error => {
        fail('The test should not have called the error handler.');
      });
  });
});
