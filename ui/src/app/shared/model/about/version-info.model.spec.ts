import { VersionInfo } from './version-info.model';

describe('VersionInfo', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a VersionInfo object', () => {
      const jsonVersionInfo = JSON.parse(`
        {
          "implementation": {
            "name": "spring-cloud-dataflow-server-local",
            "version": "1.1.1"
          },
          "core": {
            "name": "Spring Cloud Data Flow Core",
            "version": "2.2.2"
          },
          "dashboard": {
            "name": "Spring Cloud Dataflow UI",
            "version": "3.3.3"
          },
          "shell": {
            "name": "Spring Cloud Data Flow Shell",
            "version": "4.4.4",
            "url":"https://repo.spring.io/libs-snapshot/o/s/c/shell/4.4.4/dataflow-shell-4.4.4.jar"
          }
        }
      `);

      const versionInfo = new VersionInfo().deserialize(jsonVersionInfo);
      expect(versionInfo.implementation.name).toBe('spring-cloud-dataflow-server-local');
      expect(versionInfo.implementation.version).toBe('1.1.1');

      expect(versionInfo.core.name).toBe('Spring Cloud Data Flow Core');
      expect(versionInfo.core.version).toBe('2.2.2');

      expect(versionInfo.dashboard.name).toBe('Spring Cloud Dataflow UI');
      expect(versionInfo.dashboard.version).toBe('3.3.3');

      expect(versionInfo.shell.name).toBe('Spring Cloud Data Flow Shell');
      expect(versionInfo.shell.version).toBe('4.4.4');
      expect(versionInfo.shell.url).toBe('https://repo.spring.io/libs-snapshot/o/s/c/shell/4.4.4/dataflow-shell-4.4.4.jar');
    });
  });
});
