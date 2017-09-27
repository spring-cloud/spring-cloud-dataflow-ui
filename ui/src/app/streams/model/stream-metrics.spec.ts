import {
  StreamMetrics,
  ApplicationMetrics,
  InstanceMetrics,
  Metric,
} from './stream-metrics';

/**
 * Test {@link StreamDefinition} model.
 *
 * @author Glenn Renfro
 */
describe('Metric', () => {

  it('Metric simple deserialize', () => {
    const m = new Metric().deserialize({
      name: 'metric1',
      value: 5
    });
    expect(m.name).toEqual('metric1');
    expect(m.value).toEqual(5);
  });

  it ('Metric extra data present', () => {
    const m = new Metric().deserialize({
      name: 'metric',
      value: 'data',
      extra: 'more data'
    });
    expect(m.name).toEqual('metric');
    expect(m.value).toEqual('data');
  });

  it ('Metric data missing', () => {
    const m = new Metric().deserialize({
      name: 'metric',
      extra: 'more data'
    });
    expect(m.name).toEqual('metric');
    expect(m.value).toBeUndefined();
  });

});

describe('InstanceMetrics', () => {

  it('Guid and Index only deserialize', () => {
    const i = new InstanceMetrics().deserialize({
      guid: 'guid',
      index: 8,
    });
    expect(i.guid).toEqual('guid');
    expect(i.index).toEqual(8);
    expect(i.properties).toBeUndefined();
    expect(i.metrics).toEqual([]);
  });

  it('Properties deserialize', () => {
    const props = {
      p1: 'v1',
      p2: 876,
    };
    const i = new InstanceMetrics().deserialize({
      properties: props
    });
    expect(i.guid).toBeUndefined();
    expect(i.index).toBeUndefined();
    expect(i.properties).toEqual(props);
    expect(i.metrics).toEqual([]);
  });

  it('Metrics deserialize', () => {
    const i = new InstanceMetrics().deserialize({
      metrics: [
        {name: 'm1', value: 'v1'},
        {name: 'm2', value: 4}
      ]
    });
    expect(i.guid).toBeUndefined();
    expect(i.index).toBeUndefined();
    expect(i.properties).toBeUndefined();
    expect(i.metrics.length).toEqual(2);
    expect(i.metrics[0].name).toEqual('m1');
    expect(i.metrics[0].value).toEqual('v1');
    expect(i.metrics[1].name).toEqual('m2');
    expect(i.metrics[1].value).toEqual(4);
  });

});

describe('ApplicationMetrics', () => {

  it('Deserialize ApplicationMetrics only name', () => {
    const a = new ApplicationMetrics().deserialize({
      name: 'my-app'
    });
    expect(a.name).toEqual('my-app');
    expect(a.instances).toEqual([]);
    expect(a.aggregateMetrics).toEqual([]);
  });

  it('Deserialize general case', () => {
    const a = new ApplicationMetrics().deserialize({
      name: 'my-app',
      aggregateMetrics: [
        {name: 'a1', value: 'av1'},
        {name: 'a2', value: 4}
      ],
      instances: [
        {
          guid: 'i1',
          index: 0,
          metrics: [
            {name: 'm1-1', value: 'v1-1'},
            {name: 'm2-1', value: 5}
          ]
        },
        {
          guid: 'i2',
          index: 1,
          metrics: [
            {name: 'm1-2', value: 'v1-2'},
            {name: 'm2-2', value: 6}
          ]
        },
      ]
    });
    expect(a.name).toEqual('my-app');

    expect(a.aggregateMetrics.length).toEqual(2);
    expect(a.aggregateMetrics[0].name).toEqual('a1');
    expect(a.aggregateMetrics[0].value).toEqual('av1');
    expect(a.aggregateMetrics[1].name).toEqual('a2');
    expect(a.aggregateMetrics[1].value).toEqual(4);

    expect(a.instances.length).toEqual(2);
    expect(a.instances[0].guid).toEqual('i1');
    expect(a.instances[0].index).toEqual(0);
    expect(a.instances[0].metrics.length).toEqual(2);
    expect(a.instances[1].guid).toEqual('i2');
    expect(a.instances[1].index).toEqual(1);
    expect(a.instances[1].metrics.length).toEqual(2);
  });

});

describe('StreamMetrics', () => {

  it('Deserialize name only', () => {
    const s = new StreamMetrics().deserialize({
      name: 'str1'
    });
    expect(s.name).toEqual('str1');
    expect(s.applications).toEqual([]);
  });

  it ('General case for deserialize', () => {
    const s = new StreamMetrics().deserialize({
      applications: [
        {
          name: 'app-1',
          aggregateMetrics: [
            {name: 'a1', value: 'av1'}
          ],
        },
        {
          name: 'app-2',
          aggregateMetrics: [
            {name: 'a2', value: 'av2'},
            {name: 'm2-2', value: 6}
          ],
        }
      ]
    });
    expect(s.name).toBeUndefined();
    expect(s.applications.length).toEqual(2);
    expect(s.applications[0].name).toEqual('app-1');
    expect(s.applications[0].aggregateMetrics.length).toEqual(1);
    expect(s.applications[1].name).toEqual('app-2');
    expect(s.applications[1].aggregateMetrics.length).toEqual(2);
  });

});
