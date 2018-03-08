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
        'aaa',
        'aaa111',
        'aaa111.121321aaa',
        'aaaa.aaaa.aaaa'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.key(control)).toBeNull();
      });
    });
    it('invalid', () => {
      [
        'a',
        'a.aaa',
        'aa.a',
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
        'spring.cloud.dataflow.skipper.platformName'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.keyProperty(control)).toBeNull();
      });
    });
    it('invalid', () => {
      [
        'aa.aa',
        'aaa',
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

      formControl.setValue('baz');
      result = StreamDeployValidator.validateDeploymentProperties(formControl);
      expect(result.validateDeploymentProperties.reason).toBe('Invalid deployment property "baz" must contain a single "=".');
    });
  });

});
