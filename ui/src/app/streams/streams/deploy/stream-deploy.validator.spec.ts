import { FormControl } from '@angular/forms';
import { StreamDeployValidator } from './stream-deploy.validator';

describe('streams/streams/deploy/strean-deploy.validator.ts', () => {

  describe('number', () => {
    it('invalid', () => {
      [
        'foo',
        '0'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.number(control).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        '1',
        '10',
        '',
        null
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.number(control)).toBeNull();
      });
    });
  });


  describe('key', () => {
    it('invalid', () => {
      [
        'foo.',
        'asdas().asd',
        'asdas*.asd',
        'asdas=.asd',
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.key(control).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'foo.bar',
        'foo-.bar',
        'foo_.bar',
        'foo',
        null
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.key(control)).toBeNull();
      });
    });
  });

  describe('properties', () => {
    it('invalid', () => {
      [
        'foo.=bar',
        'foo.bar=bar',
        'foo-.bar=bar',
        'foo_.bar=bar',
        'foo_.bar=',
        'foo_.bar',
        'foo=bar'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.properties(control).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'app.bar=bar',
        'deployer.bar=bar',
        'version.bar=bar',
        'deployer.bar.bar=bar',
        'spring.cloud.dataflow.skipper.platformName=bar',
        null
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(StreamDeployValidator.properties(control)).toBeNull();
      });
    });
  });

  describe('property', () => {
    it('invalid', () => {
      [
        'foo.=bar',
        'foo.bar=bar',
        'foo-.bar=bar',
        'foo_.bar=bar',
        'foo_.bar=',
        'foo_.bar',
        'foo=bar'
      ].forEach((mock) => {
        expect(StreamDeployValidator.property(mock)).toBe('Not valid');
      });
    });
    it('valid', () => {
      [
        'app.bar=bar',
        'deployer.bar=bar',
        'version.bar=bar',
        'deployer.bar.bar=bar',
        'spring.cloud.dataflow.skipper.platformName=bar',
        ''
      ].forEach((mock) => {
        expect(StreamDeployValidator.property(mock)).toBeTrue();
      });
    });
  });

});
