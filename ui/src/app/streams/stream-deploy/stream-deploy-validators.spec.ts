/**
 * Test Stream Validator functions.
 *
 * @author Glenn Renfro
 */
import {validateDeploymentProperties} from './stream-deploy-validators';
import {FormControl} from '@angular/forms';

describe('StreamsDefinition', () => {

  describe('validateDeploymentProperties', () => {
    it('Verifies validateDeploymentProperties works as expected.', () => {
      const formControl = new FormControl();
      formControl.setValue('app.bar=baz');

      let result = validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('bar=baz');
      result = validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('baz');
      result = validateDeploymentProperties(formControl);
      expect(result.validateDeploymentProperties.reason).toBe('Invalid deployment property "baz" must contain a single "=".');
    });
  });
});
