import { AboutService } from './about.service';
import { Observable } from 'rxjs/Rx';
import { ErrorHandler } from '../shared/model/error-handler';
import { Response, ResponseOptions } from '@angular/http';
import { SharedAboutService } from '../shared/services/shared-about.service';

describe('AboutService', () => {

  const jsonData = {
      'featureInfo':
      {
          'analyticsEnabled': true,
          'streamsEnabled': true,
          'tasksEnabled': true,
          'skipperEnabled': true
      },
      'versionInfo':
      {
          'implementationDependency':
          {
              'name': 'spring-cloud-dataflow-server-local',
              'version': '1.2.3.BUILD-SNAPSHOT',
              'checksumSha1': 'checksumSample1',
              'checksumSha256': 'checksumSample256'
          },
          'coreDependency':
          {
              'name': 'Spring Cloud Data Flow Core',
              'version': '1.2.3.BUILD-SNAPSHOT',
              'checksumSha1': 'checksumSample1',
              'checksumSha256': 'checksumSample256'
          },
          'dashboardDependency':
          {
              'name': 'Spring Cloud Dataflow UI',
              'version': '1.2.3.RELEASE',
              'checksumSha1': 'checksumSample1',
              'checksumSha256': 'checksumSample256'
          },
        'shellDependency':
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
          'authorizationEnabled': false,
          'formLogin': false,
          'authenticated': false,
          'username': null,
          'roles':
          [
          ]
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
              {
              },
              'platformType': 'Local',
              'springBootVersion': '1.5.4.RELEASE',
              'springVersion': '4.3.9.RELEASE'
          },
          'taskLauncher':
          {
              'deployerImplementationVersion': '1.2.2.BUILD-SNAPSHOT',
              'deployerName': 'LocalTaskLauncher',
              'deployerSpiVersion': '1.2.1.RELEASE',
              'javaVersion': '1.8.0_60',
              'platformApiVersion': 'Mac OS X 10.11.6',
              'platformClientVersion': '10.11.6',
              'platformHostVersion': '10.11.6',
              'platformSpecificInfo':
              {
              },
              'platformType': 'Local',
              'springBootVersion': '1.5.4.RELEASE',
              'springVersion': '4.3.9.RELEASE'
          }
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
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    const errorHandler = new ErrorHandler();
    this.sharedAboutService = new SharedAboutService(this.mockHttp, errorHandler);
    this.aboutService = new AboutService(this.sharedAboutService, this.mockHttp, errorHandler);
  });

  it('should call the about service with the right url', () => {
    this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
    this.aboutService.getAboutInfo();
    expect(this.mockHttp.get).toHaveBeenCalledWith('/about');
  });

  it('should return the correct json data', () => {

    const mockResponse = new Response(new ResponseOptions({
      body: JSON.stringify(jsonData)
    }));

    this.mockHttp.get.and.returnValue(Observable.of(mockResponse));

    this.aboutService.getAboutInfo().toPromise().then(result => {
      expect(JSON.stringify(result)).toBe(JSON.stringify(jsonData));
    },
    error => {
      fail('The test should not have called the error handler.');
    });
  });
});
