import { RuntimeEnvironmentDetails } from './runtime-environment-details.model';

describe('RuntimeEnvironmentDetails', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a RuntimeEnvironmentDetails object', () => {
      const jsonVersionInfo = JSON.parse(`
        {
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
        }
      `);

      const runtimeEnvironmentDetails = new RuntimeEnvironmentDetails().deserialize(jsonVersionInfo);
      expect(runtimeEnvironmentDetails.deployerImplementationVersion).toBe('1.3.0.RC1');
      expect(runtimeEnvironmentDetails.deployerName).toBe('LocalAppDeployer');
      expect(runtimeEnvironmentDetails.deployerSpiVersion).toBe('1.3.0.M2');
      expect(runtimeEnvironmentDetails.javaVersion).toBe('1.8.0_60');
      expect(runtimeEnvironmentDetails.platformApiVersion).toBe('Mac OS X 10.13.2');
      expect(runtimeEnvironmentDetails.platformClientVersion).toBe('10.13.2');
      expect(runtimeEnvironmentDetails.platformHostVersion).toBe('10.13.2');

      expect(runtimeEnvironmentDetails.platformSpecificInfo.size).toBe(2);
      expect(runtimeEnvironmentDetails.platformSpecificInfo.get('spring')).toBe('rocks');
      expect(runtimeEnvironmentDetails.platformSpecificInfo.get('foo')).toBe('bar');

      expect(runtimeEnvironmentDetails.platformType).toBe('Local');
      expect(runtimeEnvironmentDetails.springBootVersion).toBe('1.5.9.RELEASE');
      expect(runtimeEnvironmentDetails.springVersion).toBe('4.3.13.RELEASE');

    });
  });
});
