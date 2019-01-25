import { GrafanaInfo } from './grafana.model';

describe('GrafanaInfo', () => {

  describe('deserialize', () => {

    it('should deserialize a json object into a GrafanaInfo object', () => {
      const json = JSON.parse(`
        {
          "url": "http://localhost:3000",
          "token": null,
          "refreshInterval": 20
        }
      `);
      const grafanaInfo = new GrafanaInfo().deserialize(json);
      expect(grafanaInfo.url).toBe('http://localhost:3000');
      expect(grafanaInfo.token).toBe('');
      expect(grafanaInfo.refreshInterval).toBe(20);
    });

  });

});
