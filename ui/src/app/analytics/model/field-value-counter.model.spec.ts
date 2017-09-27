import { FieldValueCounter } from './field-value-counter.model';

describe('FieldValueCounter', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into a FieldValueCounter object', () => {
      const jsonCounter = JSON.parse(`
          {
            "name": "language",
            "values":
            {
                "en": 4613,
                "es": 1842,
                "ja": 1693,
                "pt": 1400,
                "und": 883
            },
            "_links":
            {
                "self":
                {
                    "href": "http://localhost:9393/metrics/field-value-counters/language"
                }
            }
        }
      `);

      const counter = new FieldValueCounter().deserialize(jsonCounter);
      expect(counter.name).toEqual('language');
      expect(counter.values.length).toBe(5);

      expect(counter.values[0].key).toBe('en');
      expect(counter.values[0].value).toBe(4613);
      expect(counter.values[1].key).toBe('es');
      expect(counter.values[1].value).toBe(1842);
    });
  });
});
