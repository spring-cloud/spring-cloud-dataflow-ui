import { Counter } from './counter.model';

describe('Counter', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a ConfigurationMetadataProperty object', () => {
      const jsonCounter = JSON.parse(`
        {
          "name": "ultimate",
          "value": 42,
          "_links":
          {
              "self":
              {
                  "href": "http://localhost:9393/metrics/counters/ultimate"
              }
          }
        }
      `);

      const counter = new Counter().deserialize(jsonCounter);
      expect(counter.name).toEqual('ultimate');
      expect(counter.value).toBe(42);
    });
  });
  describe('latestRate', () => {
    it('should return the latest rate', () => {
      const counter = new Counter('myCounter', 20);
      counter.rates = [23, 14, 1, 5];
      expect(counter.latestRate).toBe(5);
    });
    it('should return undefined as rates is empty', () => {
      const counter = new Counter('myCounter', 20);
      expect(counter.latestRate).toBeUndefined();
    });
  });
});
