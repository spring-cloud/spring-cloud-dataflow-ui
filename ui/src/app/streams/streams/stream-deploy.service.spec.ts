import { StreamDeployService } from './stream-deploy.service';
import { ParserService } from '../../flo/shared/service/parser.service';
import { MockStreamsService } from '../../tests/service/stream.service.mock';
import { MockSharedAppService } from '../../tests/service/app.service.mock';
import { GET_STREAMS } from '../../tests/data/stream';

describe('streams/streams/stream-deploy.service.ts', () => {
  let streamDeployService;
  let streamService;
  let appService;
  let parserService;
  let jsonData = {};

  beforeEach(() => {
    jsonData = {};
    streamService = new MockStreamsService();
    appService = new MockSharedAppService();
    parserService = new ParserService();
    streamDeployService = new StreamDeployService(streamService, appService, parserService);
  });

  describe('keys', () => {

    it('Should test the platform key', () => {
      [
        ['spring.cloud.dataflow.skipper.platformName', true],
        ['spring.cloud.platformName', false],
      ].forEach(vals => {
        const result = StreamDeployService.platform.is(vals[0] as string);
        expect(result).toBe(vals[1] as boolean);
      });
    });

    it('Should test the deployer keys', () => {
      [
        ['deployer.*.foo', true],
        ['deployer.app.bar', true],
        ['spring.cloud.dataflow.skipper.platformName', false],
      ].forEach(vals => {
        const result = StreamDeployService.deployer.is(vals[0] as string);
        expect(result).toBe(vals[1] as boolean);
      });
    });

    it('Should extract the deployer keys', () => {
      [
        ['deployer.*.foo', 'foo'],
        ['deployer.foo', ''],
        ['deployer.app.bar', 'bar'],
      ].forEach(vals => {
        const result = StreamDeployService.deployer.extract(vals[0] as string);
        expect(result).toBe(vals[1] as string);
      });
    });

    it('Should test the version key', () => {
      [
        ['version.app', true],
        ['versionxxx.app', false],
      ].forEach(vals => {
        const result = StreamDeployService.version.is(vals[0] as string);
        expect(result).toBe(vals[1] as boolean);
      });
    });

    it('Should test the app keys', () => {
      [
        ['app.*.foo', true],
        ['app.app.bar', true],
        ['spring.cloud.dataflow.skipper.platformName', false],
      ].forEach(vals => {
        const result = StreamDeployService.app.is(vals[0] as string);
        expect(result).toBe(vals[1] as boolean);
      });
    });

    it('Should extract the deployer keys', () => {
      [
        ['app.*.foo', 'foo'],
        ['app.foo', ''],
        ['app.app.bar', 'bar'],
      ].forEach(vals => {
        const result = StreamDeployService.app.extract(vals[0] as string);
        expect(result).toBe(vals[1] as string);
      });
    });

  });

  it('config', async (done) => {
    streamService.streamDefinitions = GET_STREAMS;
    streamDeployService.config('foo').subscribe((config) => {
      expect(config.platform).not.toBeNull();
      expect(config.apps).not.toBeNull();
      expect(config.deployers).not.toBeNull();
      expect(config.id).toBe('foo');
      done();
    });
  });

  describe('appDetails', () => {

    it('Should get the details of an app', async (done) => {
      streamDeployService.appDetails('source' as any, 'time', '')
        .subscribe(arr => {
          expect(arr).not.toBeNull();
          expect(arr.length).toBe(6);
          done();
        });
    });

  });

  it('deploymentProperties', async (done) => {
    streamDeployService.deploymentProperties('foo').subscribe(args => {
      expect(args).not.toBeNull();
      done();
    });
  });

  describe('cleanValueProperties', () => {
    it('Should clean the quote/double quote (start and end of the value)', () => {
      [
        ['fooo', 'fooo'],
        ['"fooo"', 'fooo'],
      ].forEach(vals => {
        const result = streamDeployService.cleanValueProperties(vals[0]);
        expect(result).toBe(vals[1]);
      });
    });
    it('Should not clean', () => {
      [
        ['\'fooo\'', 'fooo'],
        ['fooo\'oo', 'fooo\'oo'],
        ['fooo"oo', 'fooo"oo'],
      ].forEach(vals => {
        const result = streamDeployService.cleanValueProperties(vals[0]);
        expect(result).toBe(vals[1]);
      });
    });
  });

});
