import { RuntimeEnvironment } from './runtime-environment.model';

describe('RuntimeEnvironment', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a RuntimeEnvironment object', () => {
      const jsonRuntimeEnvironment = JSON.parse(`
        {
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
          "taskLauncher": {
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
          }
        }
      `);

      const runtimeEnvironment = new RuntimeEnvironment().deserialize(jsonRuntimeEnvironment);

      expect(runtimeEnvironment.appDeployer).toBeDefined();
      expect(runtimeEnvironment.taskLauncher).toBeDefined();

      expect(runtimeEnvironment.appDeployer.deployerImplementationVersion).toBe('1.3.0.RC1');
      expect(runtimeEnvironment.appDeployer.deployerName).toBe('LocalAppDeployer');
      expect(runtimeEnvironment.appDeployer.deployerSpiVersion).toBe('1.3.0.M2');
      expect(runtimeEnvironment.appDeployer.javaVersion).toBe('1.8.0_60');
      expect(runtimeEnvironment.appDeployer.platformApiVersion).toBe('Mac OS X 10.13.2');
      expect(runtimeEnvironment.appDeployer.platformClientVersion).toBe('10.13.2');
      expect(runtimeEnvironment.appDeployer.platformHostVersion).toBe('10.13.2');
      expect(runtimeEnvironment.appDeployer.platformSpecificInfo.size).toBe(2);
      expect(runtimeEnvironment.appDeployer.platformType).toBe('Local');
      expect(runtimeEnvironment.appDeployer.springBootVersion).toBe('1.5.9.RELEASE');
      expect(runtimeEnvironment.appDeployer.springVersion).toBe('4.3.13.RELEASE');

      expect(runtimeEnvironment.taskLauncher.deployerImplementationVersion).toBe('1.3.0.RC1');
      expect(runtimeEnvironment.taskLauncher.deployerName).toBe('LocalTaskLauncher');
      expect(runtimeEnvironment.taskLauncher.deployerSpiVersion).toBe('1.3.0.M2');
      expect(runtimeEnvironment.taskLauncher.javaVersion).toBe('1.8.0_60');
      expect(runtimeEnvironment.taskLauncher.platformApiVersion).toBe('Mac OS X 10.13.2');
      expect(runtimeEnvironment.taskLauncher.platformClientVersion).toBe('10.13.2');
      expect(runtimeEnvironment.taskLauncher.platformHostVersion).toBe('10.13.2');
      expect(runtimeEnvironment.taskLauncher.platformSpecificInfo.size).toBe(0);
      expect(runtimeEnvironment.taskLauncher.platformType).toBe('Local');
      expect(runtimeEnvironment.taskLauncher.springBootVersion).toBe('1.5.9.RELEASE');
      expect(runtimeEnvironment.taskLauncher.springVersion).toBe('4.3.13.RELEASE');
    });
  });
});
