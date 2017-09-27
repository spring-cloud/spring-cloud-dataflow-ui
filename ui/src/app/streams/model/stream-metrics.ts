import { Serializable } from '../../shared/model';

export const TYPE = 'spring.cloud.dataflow.stream.app.type';
export const INSTANCE_COUNT = 'spring.cloud.stream.instanceCount';
export const INPUT_CHANNEL_MEAN = 'integration.channel.input.send.mean';
export const OUTPUT_CHANNEL_MEAN = 'integration.channel.output.send.mean';

/**
 * StreamMetrics and related model classes
 *
 * @author Alex Boyko
 */
export class Metric implements Serializable<Metric> {
  name: string;
  value: any;

  public deserialize(input) {
    this.name = input.name;
    this.value = input.value;
    return this;
  }
}

export class InstanceMetrics implements Serializable<InstanceMetrics> {
  guid: string;
  index: number;
  properties: {};
  metrics: Metric[];

  public deserialize(input) {
    this.guid = input.guid;
    this.index = input.index;
    this.properties = input.properties;
    if (Array.isArray(input.metrics)) {
      this.metrics = input.metrics.map(m => new Metric().deserialize(m));
    } else {
      this.metrics = [];
    }
    return this;
  }
}

export class ApplicationMetrics implements Serializable<ApplicationMetrics> {
  name: string;
  instances: InstanceMetrics[];
  aggregateMetrics: Metric[];

  public deserialize(input) {
    this.name = input.name;
    if (Array.isArray(input.instances)) {
      this.instances = input.instances.map(i => new InstanceMetrics().deserialize(i));
    } else {
      this.instances = [];
    }
    if (Array.isArray(input.aggregateMetrics)) {
      this.aggregateMetrics = input.aggregateMetrics.map(a => new Metric().deserialize(a));
    } else {
      this.aggregateMetrics = [];
    }
    return this;
  }
}

export class StreamMetrics implements Serializable<StreamMetrics> {
  name: string;
  applications: ApplicationMetrics[];

  public deserialize(input) {
    this.name = input.name;
    if (Array.isArray(input.applications)) {
      this.applications = input.applications.map(a => new ApplicationMetrics().deserialize(a));
    } else {
      this.applications = [];
    }
    return this;
  }
}
