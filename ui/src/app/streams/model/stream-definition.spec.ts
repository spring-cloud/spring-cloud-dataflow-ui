import {StreamDefinition} from './stream-definition';

/**
 * Test {@link StreamDefinition} model.
 *
 * @author Glenn Renfro
 */
describe('StreamsDefinition', () => {

  describe('basicValidationCheck', () => {
    it('Constructor should setup stream definition properly and expand toggle work correctly.', () => {
      const streamDefinition = new StreamDefinition('foo', 'bar', 'baz');
      expect(streamDefinition.name).toBe('foo');
      expect(streamDefinition.dslText).toBe('bar');
      expect(streamDefinition.status).toBe('baz');
      expect(streamDefinition.isExpanded).toBe(false);
      streamDefinition.toggleIsExpanded();
      expect(streamDefinition.isExpanded).toBe(true);
    });
  });
});
