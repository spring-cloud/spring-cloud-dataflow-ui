import {FormControl, FormGroup} from '@angular/forms';
import {AppsBulkImportValidator} from './apps-bulk-import.validator';

/**
 * Test Applications Bulk Import Validator functions {AppsBulkImportValidator}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportValidator', () => {

  describe('form', () => {

    it('invalid: empty or 2 values set', () => {
      const form: FormGroup = new FormGroup({
        'properties': new FormControl(''),
        'uri': new FormControl('')
      });
      expect(AppsBulkImportValidator.form(form).invalid).toBeTruthy();
      form.get('uri').setValue('http://foo.ly/foo-bar-foo');
      form.get('properties').setValue('foo=bar');
      expect(AppsBulkImportValidator.form(form).both).toBeTruthy();
    });

    it('valid', () => {
      [
        {properties: '', uri: 'http://foo.ly/foo-bar-foo'},
        {properties: 'foo=http://foo.ly/foo-bar-foo', uri: ''},
      ].forEach((mock) => {
        const form: FormGroup = new FormGroup({
          'properties': new FormControl(mock.properties),
          'uri': new FormControl(mock.uri)
        });
        expect(AppsBulkImportValidator.form(form)).toBeNull();
      });
    });

  });

  describe('uri', () => {
    it('invalid', () => {
      [
        ' ',
        'bb',
        'b b'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsBulkImportValidator.uri(uri).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'http://foo.ly/foo',
        'http://foo.bar:bar.foo-foo:bar-bar'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsBulkImportValidator.uri(uri)).toBeNull();
      });
    });
  });

  describe('properties', () => {
    it('invalid', () => {
      [
        'foo',
        'foo='
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsBulkImportValidator.properties(uri).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'foo=http://foo.ly/foo',
        'bar=http://foo.bar:bar.foo-foo:bar-bar'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsBulkImportValidator.properties(uri)).toBeNull();
      });
    });
  });

});
