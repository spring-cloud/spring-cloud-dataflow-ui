import { FormControl } from '@angular/forms';
import { AppsAddValidator } from './add.validtor';

describe('apps/add/add.validator.ts', () => {

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
        'foo = https://foo.ly/foo',
        'foo= https://foo.ly/foo',
        'foo =https://foo.ly/foo',
        ' foo=https://foo.ly/foo',
        ' foo=https://foo.ly/foo ',
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


  describe('appName', () => {

    it('invalid', () => {
      [' ', 'f'].forEach((mock) => {
        const appName: FormControl = new FormControl(mock);
        const result = AppsAddValidator.appName(appName);
        expect(result.invalid).toBeTruthy();
      });
    });

    it('valid', () => {
      [null, 'fo', 'foo', 'f12', 'foo12', 'foooooooooooooooooooooooooo', 'fo ', 'foo>', 'foo.', 'foo/', 'foo?', 'foo-',
        'foo{', 'foo}', 'foo^', 'foo$', 'foo#', 'foo@', 'foo*', 'foo(', 'foo)', 'foo[', 'foo]', 'foo<', 'foo>',
        'foo,', 'foo!', 'foo|', 'foo bar'].forEach((mock) => {
        const appName: FormControl = new FormControl(mock);
        const result = AppsAddValidator.appName(appName);
        expect(result).toBeNull();
      });
    });

  });

  describe('appUri', () => {
    it('invalid', () => {
      [
        ' ',
        'f'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        const result = AppsAddValidator.appUri(uri);
        expect(result.invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        null,
        'https://foo.bar',
        'https://foo.bar:bar',
        'https://foo.bar:bar',
        'https://foo.bar:bar-foo',
        'https://foo.bar:1.0.0-BUILD-SNAPSHOT',
        'https://foo.bar:1.0.0',
        'https://foo.bar:bar.foo:bar',
        'https://foo.bar:bar.foo-foo:bar',
        'https://foo.bar:bar.foo-foo:bar-bar',
        'docker:sabby/xfmr:0.0.7.BUILD-SNAPSHOT',
        'https://bit.ly/Celsius-BUILD-SNAPSHOT-stream-applications-kafka-10-maven',
        'https://bit.ly/Clark-BUILD-SNAPSHOT-task-applications-maven',
        'docker:springcloudstream/counter-sink-rabbit:1.3.1.RELEASE',
        'docker:spring_cloud_stream/counter-sink_rabbit:1.3.1.RELEASE'
      ].forEach((mock) => {
        const uri: FormControl = new FormControl(mock);
        const result = AppsAddValidator.appUri(uri);
        expect(result).toBeNull();
      });
    });

  });

});
