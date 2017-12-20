import { FeatureInfo } from './feature-info.model';

describe('FeatureInfo', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a FeatureInfo object', () => {
      const jsonFeatureInfo = JSON.parse(`
        {
          "analyticsEnabled": true,
          "streamsEnabled": false,
          "tasksEnabled": true
        }
      `);

      const featureInfo = new FeatureInfo().deserialize(jsonFeatureInfo);
      expect(featureInfo.analyticsEnabled).toBe(true);
      expect(featureInfo.streamsEnabled).toBe(false);
      expect(featureInfo.tasksEnabled).toBe(true);
    });
  });
  describe('reset', () => {
    it('should reset the FeatureInfo object to default values', () => {
      const featureInfo = new FeatureInfo();

      expect(featureInfo.analyticsEnabled).toBe(false);
      expect(featureInfo.streamsEnabled).toBe(false);
      expect(featureInfo.tasksEnabled).toBe(false);

      featureInfo.analyticsEnabled = true;
      featureInfo.streamsEnabled = true;
      featureInfo.tasksEnabled = true;

      expect(featureInfo.analyticsEnabled).toBe(true);
      expect(featureInfo.streamsEnabled).toBe(true);
      expect(featureInfo.tasksEnabled).toBe(true);

      featureInfo.reset();

      expect(featureInfo.analyticsEnabled).toBe(false);
      expect(featureInfo.streamsEnabled).toBe(false);
      expect(featureInfo.tasksEnabled).toBe(false);
    });
  });
  describe('isFeatureEnabled', () => {
    it('should show that the standard features are enabled', () => {
      const featureInfo = new FeatureInfo();

      featureInfo.analyticsEnabled = true;
      featureInfo.streamsEnabled = true;
      featureInfo.tasksEnabled = true;

      expect(featureInfo.isFeatureEnabled('analyticsEnabled')).toBe(true);
      expect(featureInfo.isFeatureEnabled('streamsEnabled')).toBe(true);
      expect(featureInfo.isFeatureEnabled('tasksEnabled')).toBe(true);
    });
    it('should show that the standard features are disabled by default', () => {
      const featureInfo = new FeatureInfo();
      expect(featureInfo.isFeatureEnabled('analyticsEnabled')).toBe(false);
      expect(featureInfo.isFeatureEnabled('streamsEnabled')).toBe(false);
      expect(featureInfo.isFeatureEnabled('tasksEnabled')).toBe(false);
    });
    it('should show that unsupported features return false', () => {
      const featureInfo = new FeatureInfo();
      expect(featureInfo.isFeatureEnabled('does-not-exist')).toBe(false);
    });
  });
});
