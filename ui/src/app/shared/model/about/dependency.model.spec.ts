import { Dependency } from './dependency.model';

describe('Dependency', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a FeatureInfo object', () => {
      const jsonFeatureInfo = JSON.parse(`
        {
          "name": "Spring Cloud Data Flow Shell",
          "version": "1.2.3",
          "url": "https://repo.spring.io/libs-snapshot/o/s/c/shell/1.2.3/shell-1.2.3.jar",
          "checksumSha1": "123456789",
          "checksumSha256": "abcdefgh"
        }
      `);

      const dependency = new Dependency().deserialize(jsonFeatureInfo);
      expect(dependency.name).toBe('Spring Cloud Data Flow Shell');
      expect(dependency.version).toBe('1.2.3');
      expect(dependency.url).toBe('https://repo.spring.io/libs-snapshot/o/s/c/shell/1.2.3/shell-1.2.3.jar');
      expect(dependency.checksumSha1).toBe('123456789');
      expect(dependency.checksumSha256).toBe('abcdefgh');
    });
  });
});
