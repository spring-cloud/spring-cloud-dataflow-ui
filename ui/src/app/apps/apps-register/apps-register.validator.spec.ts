import {FormControl, FormGroup} from '@angular/forms';
import {AppsRegisterValidator} from './apps-register.validator';

/**
 * Test Application Register Validator functions {AppsRegisterValidator}.
 *
 * @author Damien Vitrac
 */
describe('AppsRegisterValidator', () => {

  describe('appName', () => {

    it('invalid', () => {
      [' ', 'f'].forEach((mock) => {
        const appName: FormControl = new FormControl(mock);
        const result = AppsRegisterValidator.appName(appName);
        expect(result.invalid).toBeTruthy();
      });
    });

    it('valid', () => {
      [null, 'fo', 'foo', 'f12', 'foo12', 'foooooooooooooooooooooooooo', 'fo ', 'foo>', 'foo.', 'foo/', 'foo?', 'foo-',
        'foo{', 'foo}', 'foo^', 'foo$', 'foo#', 'foo@', 'foo*', 'foo(', 'foo)', 'foo[', 'foo]', 'foo<', 'foo>',
        'foo,', 'foo!', 'foo|', 'foo bar'].forEach((mock) => {
        const appName: FormControl = new FormControl(mock);
        const result = AppsRegisterValidator.appName(appName);
        expect(result).toBeNull();
      });
    });

  });

  // TODO: to complete
  describe('uri', () => {
    it('invalid', () => {
      [
        ' ',
        /*'http://foo. bar',
        'http://foo.b@r',
        'http://foo.b%%r',*/
        'f'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        const result = AppsRegisterValidator.uri(uri);
        expect(result.invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        null,
        'http://foo.bar',
        'http://foo.bar:bar',
        'http://foo.bar:bar',
        'http://foo.bar:bar-foo',
        'http://foo.bar:1.0.0-BUILD-SNAPSHOT',
        'http://foo.bar:1.0.0',
        'http://foo.bar:bar.foo:bar',
        'http://foo.bar:bar.foo-foo:bar',
        'http://foo.bar:bar.foo-foo:bar-bar',
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        const result = AppsRegisterValidator.uri(uri);
        expect(result).toBeNull();
      });
    });

  });

});
