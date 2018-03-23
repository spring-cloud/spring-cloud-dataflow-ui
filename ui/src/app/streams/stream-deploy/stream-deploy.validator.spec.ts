import {FormControl} from '@angular/forms';
import {StreamDeployValidator} from './stream-deploy.validator';

/**
 * Test Stream Validator functions.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsDefinitionValidator', () => {

  describe('Number', () => {
    it('valid', () => {
      [
        '',
        '1',
        '11',
        '012'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.number(control)).toBeNull();
      });
    });
    it('invalid', () => {
      [
        '1 ',
        '0',
        '-1',
        ' 1',
        '012z',
        '012.9'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.number(control).invalid).toBeTruthy();
      });
    });
  });

  describe('key', () => {
    it('valid', () => {
      [
        'aa.aa',
        'aa.a',
        'a',
        'a.a',
        'aaa',
        'aaa111',
        'aaa111.121321aaa',
        'aaa111.1213_21aaa',
        'aaa111.1213-21aaa',
        'aaaa.aaaa.aaaa',
        'metrics.schedule-interval',
        'applicationMetrics.destination'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.key(control)).toBeNull();
      });
    });
    it('invalid', () => {
      [
        'a.',
        'aa.',
        '.aaaa',
        'aaa.%aa',
        '  aaa.aaa',
        ' aaa',
        'aaaa.aaaa aaaa'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.key(control).invalid).toBeTruthy();
      });
    });
  });

  describe('keyProperty', () => {
    it('valid', () => {
      [
        'app.*.foo',
        'app.file.foo',
        'version.file',
        'deployer.*.foo',
        'deployer.file.foo',
        'spring.cloud.dataflow.skipper.platformName',
        'app.*.spring.cloud.stream.bindings.applicationMetrics.destination',
        'app.*.spring.cloud.stream.metrics.schedule-interval'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.keyProperty(control)).toBeNull();
      });
    });
    it('invalid', () => {
      [
        'aa.aa',
        'aaa',
        'app',
        'app.',
        'deployer',
        'version',
        'aaa111',
        'aaa111.121321aaa',
        'aaaa.aaaa.aaaa'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.keyProperty(control).invalid).toBeTruthy();
      });
    });
  });

  describe('validateDeploymentProperties', () => {
    it('Verifies validateDeploymentProperties works as expected.', () => {
      const formControl = new FormControl();
      formControl.setValue('app.bar=baz');

      let result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('bar=baz');
      result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('app.*.spring.cloud.stream.bindings.applicationMetrics.destination=metrics');
      result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('app.*.spring.cloud.stream.metrics.schedule-interval=PT10S');
      result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result).toBe(undefined);

      formControl.setValue('baz');
      result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result.validateDeploymentProperties.reason).toBe('Invalid deployment property "baz" must contain a single "=".');
    });
  });

});
