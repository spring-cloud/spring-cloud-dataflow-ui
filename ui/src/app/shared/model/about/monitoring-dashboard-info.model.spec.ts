import { MonitoringDashboardInfo } from './monitoring-dashboard-info.model';

describe('MonitoringDashboardInfo', () => {

  describe('deserialize', () => {

    it('should deserialize a json object into a MonitoringDashboardInfo object', () => {
      const json = JSON.parse(`
        {
          "url": "http://localhost:3000",
          "token": null,
          "refreshInterval": 20,
          "source": "foo"
        }
      `);
      const monitoringDashboardInfo = new MonitoringDashboardInfo().deserialize(json);
      expect(monitoringDashboardInfo.url).toBe('http://localhost:3000');
      expect(monitoringDashboardInfo.token).toBe('');
      expect(monitoringDashboardInfo.source).toBe('foo');
      expect(monitoringDashboardInfo.refreshInterval).toBe(20);
    });

  });

});
