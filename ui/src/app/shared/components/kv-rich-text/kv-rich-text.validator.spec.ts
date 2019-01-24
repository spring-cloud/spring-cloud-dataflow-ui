import { FormControl, Validators } from '@angular/forms';
import { KvRichTextValidator } from './kv-rich-text.validator';

/**
 * Test Key/Value Rich Text Validator functions {KvRichTextValidator}.
 *
 * @author Damien Vitrac
 */
describe('KvRichTextValidator', () => {

  describe('validateSyntax', () => {

    it('invalid (return error)', () => {
      [
        'foo',
        ' foo',
        ' foo ',
      ].forEach((mock) => {
        expect(KvRichTextValidator.validateSyntax(mock)).toBe('Invalid key/value property');
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
        expect(KvRichTextValidator.validateSyntax(mock)).toBeNull();
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
        expect(KvRichTextValidator.splitValue(mock)).toBeNull();
      });
    });

    it('valid (return key/value object)', () => {
      [
        { mock: '=', key: '', value: '' },
        { mock: 'foo=bar', key: 'foo', value: 'bar' },
        { mock: '=bar', key: '', value: 'bar' },
        { mock: 'foo=', key: 'foo', value: '' }
      ].forEach((mock) => {
        const split = KvRichTextValidator.splitValue(mock.mock);
        expect(split.key).toBe(mock.key);
        expect(split.value).toBe(mock.value);
      });
    });

  });

  describe('validateKvRichText', () => {

    describe('invalid', () => {

      it('invalid (main syntax)', () => {
        const control = new FormControl('foo=bar\nfoo');
        const result = KvRichTextValidator.validateKvRichText({ key: [], value: [] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

      it('invalid (custom validator on key)', () => {
        const control = new FormControl('foo=bar\n=foo');
        const result = KvRichTextValidator.validateKvRichText({ key: [Validators.required], value: [] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

      it('invalid (custom validator on value)', () => {
        const control = new FormControl('foo=bar\nfoo=');
        const result = KvRichTextValidator.validateKvRichText({ key: [], value: [Validators.required] })(control);
        expect(result.syntaxError.errors.length === 1).toBeTruthy();
      });

    });

    it('valid', () => {
      const control = new FormControl('foo=bar\nfoo=');
      const result = KvRichTextValidator.validateKvRichText({ key: [], value: [] })(control);
      expect(result).toBeNull();
    });

  });

});
