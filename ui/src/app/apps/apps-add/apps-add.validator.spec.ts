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
        'https://foo.ly/foo',
        'https://foo.bar:bar.foo-foo:bar-bar',
        'https://foo.bar/foo.bar&a=a',
        'https://foo.bar/foo.bar&b=b?a=a'
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
        'foo=https://foo.ly/foo',
        'bar=https://foo.bar:bar.foo-foo:bar-bar',
        'source.user-producer=docker:sabby/user-producer:0.0.1-SNAPSHOT',
        'processor.user-by-region=docker:sabby/user-consumer:0.0.1-SNAPSHOT',
        'app.user-producer-app=docker:sabby/user-producer:0.0.1-SNAPSHOT',
        'app.user-by-region-app=docker:sabby/user-consumer:0.0.1-SNAPSHOT',
        'app.websocket-app=docker:springcloudstream/websocket-sink-kafka-10:1.3.1.RELEASE',
        'source.foo=maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        expect(AppsAddValidator.properties(uri)).toBeNull();
      });
    });
  });

});
