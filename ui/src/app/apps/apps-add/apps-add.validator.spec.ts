import { FormControl } from '@angular/forms';
import { AppsAddValidator } from './apps-add.validator';

/**
 * Test Applications Bulk Import Validator functions {AppsAddValidator}.
 *
 * @author Damien Vitrac
 */
describe('AppsAddValidator', () => {

  describe('uri', () => {
    it('invalid', () => {
      [
        ' ',
        'bb',
        'b b'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsAddValidator.uri(uri).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'http://foo.ly/foo',
        'http://foo.bar:bar.foo-foo:bar-bar',
        'http://foo.bar/foo.bar&a=a',
        'http://foo.bar/foo.bar&b=b?a=a'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsAddValidator.uri(uri)).toBeNull();
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
        expect(AppsAddValidator.properties(uri).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'foo=http://foo.ly/foo',
        'bar=http://foo.bar:bar.foo-foo:bar-bar'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsAddValidator.properties(uri)).toBeNull();
      });
    });
  });

});
