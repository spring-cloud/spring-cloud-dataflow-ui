import { StreamStatuses, StreamStatus, InstanceStatus } from './stream-metrics';

/**
 * Test {@link StreamDefinition} model.
 *
 * @author Glenn Renfro
 */
describe('InstanceStatus', () => {

  it('Guid and Index only deserialize', () => {
    const i = InstanceStatus.fromJSON({
      guid: 'guid',
      index: 8,
      state: 'deployed'
    });
    expect(i.guid).toEqual('guid');
    expect(i.index).toEqual(8);
    expect(i.state).toEqual('deployed');
  });

  it('Properties deserialize', () => {
    const props = {
      p1: 'v1',
      p2: 876,
    };
    const i = InstanceStatus.fromJSON({
      properties: props
    });
    expect(i.guid).toBeUndefined();
    expect(i.index).toBeUndefined();
  });

});

describe('StreamStatus', () => {

  it('Deserialize StreamStatus only name', () => {
    const a = StreamStatus.fromJSON({
      name: 'my-app'
    });
    expect(a.name).toEqual('my-app');
    expect(a.instances).toEqual([]);
  });

  it('Deserialize general case', () => {
    const a = StreamStatus.fromJSON({
      name: 'my-app',

      instances: {
        _embedded: {
          appInstanceStatusResourceList: [
            {
              guid: 'i1',
              index: 0
            },
            {
              guid: 'i2',
              index: 1
            },
          ]
        }
      }
    });
    expect(a.name).toEqual('my-app');

    expect(a.instances.length).toEqual(2);
    expect(a.instances[0].guid).toEqual('i1');
    expect(a.instances[0].index).toEqual(0);
    expect(a.instances[1].guid).toEqual('i2');
    expect(a.instances[1].index).toEqual(1);
  });

});

describe('StreamStatuses', () => {

  it('Deserialize name only', () => {
    const s = StreamStatuses.fromJSON({
      name: 'str1'
    });
    expect(s.name).toEqual('str1');
    expect(s.applications).toEqual([]);
  });

  it('General case for deserialize', () => {
    const s = StreamStatuses.fromJSON({
      applications: {
        _embedded: {
          appStatusResourceList: [
            {
              name: 'app-1'
            },
            {
              name: 'app-2'
            }
          ]
        }
      },
    });
    expect(s.name).toBeUndefined();
    expect(s.applications.length).toEqual(2);
    expect(s.applications[0].name).toEqual('app-1');
    expect(s.applications[1].name).toEqual('app-2');
  });

});
