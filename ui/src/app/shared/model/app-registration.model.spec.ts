import { AppRegistration } from './app-registration.model';
import { ApplicationType } from './application-type';

describe('AppRegistration', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a AppRegistration object', () => {
      const json = {
        'name': 'file',
        'type': 'source',
        'version': '1.2.0.RELEASE',
        'defaultVersion': true,
        'uri': 'maven://org.springframework.cloud.stream.app:file-source-rabbit:1.2.0.RELEASE',
        '_links':
        {
            'self':
            {
                'href': 'http://localhost:9393/apps/source/file'
            }
        }
      };

      const appRegistration = new AppRegistration().deserialize(json);
      expect(appRegistration.name).toBe('file');
      expect(appRegistration.type.toString()).toEqual(ApplicationType[ApplicationType.source].toString());
      expect(appRegistration.uri).toBe('maven://org.springframework.cloud.stream.app:file-source-rabbit:1.2.0.RELEASE');
      expect(appRegistration.version).toBe('1.2.0.RELEASE');
      expect(appRegistration.defaultVersion).toBe(true);
    });
  });
});
