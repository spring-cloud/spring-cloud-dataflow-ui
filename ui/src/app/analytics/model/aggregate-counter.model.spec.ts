import { AggregateCounter } from './aggregate-counter.model';
import * as moment from 'moment';
import { Moment } from 'moment';

describe('AggregateCounter', () => {
  describe('deserialize', () => {
    it('should deserialize a json object into an AggregateCounter object', () => {
      const jsonCounter = JSON.parse(`
          {
            "name": "aggregate-counter-sink",
            "counts":
            {
              "2017-09-27T00:03:58.378Z": 654,
              "2017-09-27T00:04:58.378Z": 861,
              "2017-09-27T00:05:58.378Z": 4264,
              "2017-09-27T00:06:58.378Z": 6178
            },
            "_links":
            {
                "self":
                {
                    "href": "http://localhost:9393/metrics/aggregate-counters/aggregate-counter-sink"
                }
            }
        }
      `);

      const counter = new AggregateCounter().deserialize(jsonCounter);
      expect(counter.name).toEqual('aggregate-counter-sink');
      expect(counter.counts.length).toBe(4);

      const expectedTime0: Moment = moment('2017-09-27T00:03:58.378Z');
      const expectedTime1: Moment = moment('2017-09-27T00:04:58.378Z');

      expect(counter.counts[0].key.hour).toBe(expectedTime0.hour);
      expect(counter.counts[0].key.year).toBe(expectedTime0.year);
      expect(counter.counts[0].key.month).toBe(expectedTime0.month);
      expect(counter.counts[0].key.hour).toBe(expectedTime0.hour);
      expect(counter.counts[0].value).toBe(654);
      expect(counter.counts[1].key.hour).toBe(expectedTime1.hour);
      expect(counter.counts[1].value).toBe(861);
    });
  });
  describe('getValues', () => {
    it('should deserialize a json object into an AggregateCounter object and return only the values', () => {
      const jsonCounter = JSON.parse(`
          {
            "name": "aggregate-counter-sink",
            "counts":
            {
              "2017-09-27T00:03:58.378Z": 654,
              "2017-09-27T00:04:58.378Z": 861,
              "2017-09-27T00:05:58.378Z": 4264,
              "2017-09-27T00:06:58.378Z": 6178
            },
            "_links":
            {
                "self":
                {
                    "href": "http://localhost:9393/metrics/aggregate-counters/aggregate-counter-sink"
                }
            }
        }
      `);

      const counter = new AggregateCounter().deserialize(jsonCounter);

      const values = counter.getValues();

      expect(values.length).toBe(4);

      const expectedTime0: Moment = moment('2017-09-27T00:03:58.378Z');
      const expectedTime1: Moment = moment('2017-09-27T00:04:58.378Z');

      expect(values[0]).toBe(654);
      expect(values[1]).toBe(861);
    });
  });
});
