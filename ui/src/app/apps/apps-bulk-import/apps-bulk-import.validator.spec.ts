import {FormControl, FormGroup} from '@angular/forms';
import {AppsBulkImportValidator} from './apps-bulk-import.validator';

/**
 * Test Applications Bulk Import Validator functions {AppsBulkImportValidator}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportValidator', () => {

  describe('uri', () => {
    it('invalid', () => {
      [
        ' ',
        'bb',
        ' http://foo.ly/foo',
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
