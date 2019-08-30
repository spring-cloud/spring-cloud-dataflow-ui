import { StreamDefinition } from './stream-definition';

/**
 * Test {@link StreamDefinition} model.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsDefinition', () => {

  describe('basicValidationCheck', () => {
    it('Constructor should setup stream definition properly and expand toggle work correctly.', () => {
      const streamDefinition = new StreamDefinition('foo', 'bar', 'bar1', 'demo-description', 'baz');
      expect(streamDefinition.name).toBe('foo');
      expect(streamDefinition.dslText).toBe('bar');
      expect(streamDefinition.originalDslText).toBe('bar1');
      expect(streamDefinition.status).toBe('baz');
      expect(streamDefinition.description).toBe('demo-description');
      expect(streamDefinition.force).toBe(false);
    });
  });
});
