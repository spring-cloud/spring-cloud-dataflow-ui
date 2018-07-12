import { StreamHistory } from './stream-history';

/**
 * Test {@link StreamHistory} model.
 *
 * @author Damien Vitrac
 */
describe('StreamHistory', () => {

  describe('basicValidationCheck', () => {
    it('Constructor should setup stream history properly.', () => {
      const date = new Date();
      const history = new StreamHistory('foo', 1, date, 'deployed', 'Upgrade complete', 'default');
      expect(history.stream).toBe('foo');
      expect(history.version).toBe(1);
      expect(history.firstDeployed).toBe(date);
      expect(history.statusCode).toBe('deployed');
      expect(history.description).toBe('Upgrade complete');
      expect(history.platformName).toBe('default');
    });
  });

});
