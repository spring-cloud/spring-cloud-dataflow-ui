import { FormControl, Validators } from '@angular/forms';
import { KeyValueValidator } from './key-value.validator';

describe('KeyValueValidator', () => {

  describe('validateSyntax', () => {

    it('invalid (return error)', () => {
      [
        'foo',
        ' foo',
        ' foo ',
      ].forEach((mock) => {
        expect(KeyValueValidator.validateSyntax(mock)).toBe('Invalid key/value property');
      });
    });

    it('valid (return null)', () => {
      [
        undefined,
        null,
        '',
        ' ',
        '  ',
        'foo=bar',
        'foo=',
        '='
      ].forEach((mock) => {
        expect(KeyValueValidator.validateSyntax(mock)).toBeNull();
      });
    });

  });

  describe('splitValue', () => {

    it('invalid (return null)', () => {
      [
        'foo',
        ' foo',
        ' foo ',
        undefined,
        null,
      ].forEach((mock) => {
        expect(KeyValueValidator.splitValue(mock)).toBeNull();
      });
    });

    it('valid (return key/value object)', () => {
      [
        { mock: '=', key: '', value: '' },
        { mock: 'foo=bar', key: 'foo', value: 'bar' },
        { mock: '=bar', key: '', value: 'bar' },
        { mock: 'foo=', key: 'foo', value: '' }
      ].forEach((mock) => {
        const split = KeyValueValidator.splitValue(mock.mock);
        expect(split.key).toBe(mock.key);
        expect(split.value).toBe(mock.value);
      });
    });

  });

  describe('validateKvRichText', () => {

    describe('invalid', () => {

      it('invalid (main syntax)', () => {
        const control = new FormControl('foo=bar\nfoo');
        const result = KeyValueValidator.validateKeyValue({ key: [], value: [] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

      it('invalid (custom validator on key)', () => {
        const control = new FormControl('foo=bar\n=foo');
        const result = KeyValueValidator.validateKeyValue({ key: [Validators.required], value: [] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

      it('invalid (custom validator on value)', () => {
        const control = new FormControl('foo=bar\nfoo=');
        const result = KeyValueValidator.validateKeyValue({ key: [], value: [Validators.required] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

    });

  });

  describe('valid', () => {

    it('2 lines', () => {
      const control = new FormControl('foo=bar\nfoo2=bar2');
      const result = KeyValueValidator.validateKeyValue({ key: [], value: [] })(control);
      expect(result).toBeNull();
    });

    it('2 lines and one empty', () => {
      const control = new FormControl('foo=bar\n\nfoo2=bar2');
      const result = KeyValueValidator.validateKeyValue({ key: [], value: [] })(control);
      expect(result).toBeNull();
    });

    it('2 lines and 2 empties (start and end)', () => {
      const control = new FormControl('\nfoo=bar\nfoo2=bar2\n');
      const result = KeyValueValidator.validateKeyValue({ key: [], value: [] })(control);
      expect(result).toBeNull();
    });


  });

});
