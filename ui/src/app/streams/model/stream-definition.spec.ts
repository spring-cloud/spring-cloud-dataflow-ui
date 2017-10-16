import {StreamDefinition} from './stream-definition';

/**
 * Test {@link StreamDefinition} model.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsDefinition', () => {

  describe('basicValidationCheck', () => {
    it('Constructor should setup stream definition properly and expand toggle work correctly.', () => {
      const streamDefinition = new StreamDefinition('foo', 'bar', 'baz');
      expect(streamDefinition.name).toBe('foo');
      expect(streamDefinition.dslText).toBe('bar');
      expect(streamDefinition.status).toBe('baz');
      expect(streamDefinition.force).toBe(false);
      expect(streamDefinition.isExpanded).toBe(false);
      streamDefinition.toggleIsExpanded();
      expect(streamDefinition.isExpanded).toBe(true);
      streamDefinition.isSelected = true
      expect(streamDefinition.force).toBe(true);
      expect(Object.keys(streamDefinition.deploymentProperties).length).toBe(0);
    });
  });
});
