import { AboutInfo } from './about-info.model';

describe('AboutInfo', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a AboutInfo object', () => {
      const jsonAboutInfo = JSON.parse(`
        {
          "featureInfo": {
            "streamsEnabled": true,
            "grafanaEnabled": false,
            "tasksEnabled": true
          },
          "grafanaInfo": {
            "url": null,
            "token": null,
            "refreshInterval": 20
          },
          "versionInfo": {
            "implementation": {
              "name": "spring-cloud-dataflow-server-local",
              "version": "1.3.0.BUILD-SNAPSHOT"
            },
            "core": {
              "name": "Spring Cloud Data Flow Core",
              "version": "1.3.0.BUILD-SNAPSHOT"
            },
            "dashboard": {
              "name": "Spring Cloud Dataflow UI",
              "version": "1.3.0.RC1"
            },
            "shell": {
              "name": "Spring Cloud Data Flow Shell",
              "version": "1.3.0.BUILD-SNAPSHOT",
              "url": "https://repo.spring.io/libs-snapshot/o/s/c/shell/1.3.0/shell-1.3.0.jar"
            }
          },
          "securityInfo": {
            "authenticationEnabled": false,
            "authenticated": false,
            "username": null,
            "roles": []
          },
          "runtimeEnvironment": {
            "appDeployer": {
              "deployerImplementationVersion": "1.3.0.RC1",
              "deployerName": "LocalAppDeployer",
              "deployerSpiVersion": "1.3.0.M2",
              "javaVersion": "1.8.0_60",
              "platformApiVersion": "Mac OS X 10.13.2",
              "platformClientVersion": "10.13.2",
              "platformHostVersion": "10.13.2",
              "platformSpecificInfo": {
                "spring": "rocks",
                "foo": "bar"
              },
              "platformType": "Local",
              "springBootVersion": "1.5.9.RELEASE",
              "springVersion": "4.3.13.RELEASE"
            },
            "taskLaunchers": [{
              "deployerImplementationVersion": "1.3.0.RC1",
              "deployerName": "LocalTaskLauncher",
              "deployerSpiVersion": "1.3.0.M2",
              "javaVersion": "1.8.0_60",
              "platformApiVersion": "Mac OS X 10.13.2",
              "platformClientVersion": "10.13.2",
              "platformHostVersion": "10.13.2",
              "platformSpecificInfo": {},
              "platformType": "Local",
              "springBootVersion": "1.5.9.RELEASE",
              "springVersion": "4.3.13.RELEASE"
            }]
          },
          "_links": {
            "self": {
              "href": "http://localhost:9393/about"
            }
          }
        }
      `);

      const aboutInfo = new AboutInfo().deserialize(jsonAboutInfo);
      expect(aboutInfo.featureInfo).toBeDefined();
      expect(aboutInfo.runtimeEnvironment).toBeDefined();
      expect(aboutInfo.securityInfo).toBeDefined();
      expect(aboutInfo.versionInfo).toBeDefined();
      expect(aboutInfo.grafanaInfo).toBeDefined();
    });
  });
});
