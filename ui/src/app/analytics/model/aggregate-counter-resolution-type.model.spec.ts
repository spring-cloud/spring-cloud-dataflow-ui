import { AggregateCounterResolutionType } from './aggregate-counter-resolution-type.model';

describe('AggregateCounterResolutionType', () => {
  describe('getMetricTypes', () => {
    it('should return the expected number of AggregateCounterResolutionTypes', () => {
      const types: AggregateCounterResolutionType[] = AggregateCounterResolutionType.getAggregateCounterResolutionTypes();

      expect(types.length).toBe(5);
      expect(types[0].name).toEqual('Minute');
      expect(types[1].name).toEqual('Hour');
      expect(types[2].name).toEqual('Day');
      expect(types[3].name).toEqual('Month');
      expect(types[4].name).toEqual('Year');

      expect(types[0].id).toBe(1);
      expect(types[1].id).toBe(2);
      expect(types[2].id).toBe(3);
      expect(types[3].id).toBe(4);
      expect(types[4].id).toBe(5);

      expect(types[0].isDefault).toBe(true);
      expect(types[1].isDefault).toBe(false);
      expect(types[2].isDefault).toBe(false);
      expect(types[3].isDefault).toBe(false);
      expect(types[4].isDefault).toBe(false);
    });
  });
});
