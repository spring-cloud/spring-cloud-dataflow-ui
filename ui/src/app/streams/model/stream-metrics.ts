export const TYPE = 'spring.cloud.dataflow.stream.app.type';
export const INSTANCE_COUNT = 'spring.cloud.stream.instanceCount';
export const INPUT_CHANNEL_MEAN = 'integration.channel.input.send.mean';
export const OUTPUT_CHANNEL_MEAN = 'integration.channel.output.send.mean';

/**
 * StreamMetrics and related model classes
 *
 * @author Alex Boyko
 */
export class InstanceMetrics {
  guid: string;
  index: number;
  properties: {};
  state: string;

  static fromJSON(input): InstanceMetrics {
    const instanceMetrics = new InstanceMetrics();
    instanceMetrics.guid = input.guid;
    instanceMetrics.index = input.index;
    instanceMetrics.properties = input.properties;
    instanceMetrics.state = input.state;
    return instanceMetrics;
  }

}

export class ApplicationMetrics {
  name: string;
  instances: InstanceMetrics[];

  static fromJSON(input) {
    const applicationMetrics = new ApplicationMetrics();
    applicationMetrics.name = input.name;
    if (Array.isArray(input.instances)) {
      applicationMetrics.instances = input.instances.map(InstanceMetrics.fromJSON);
    } else {
      applicationMetrics.instances = [];
    }
    return applicationMetrics;
  }
}

export class StreamMetrics {
  name: string;
  applications: ApplicationMetrics[];

  static fromJSON(input): StreamMetrics {
    const streamMetrics = new StreamMetrics();
    streamMetrics.name = input.name;
    if (Array.isArray(input.applications)) {
      streamMetrics.applications = input.applications.map(ApplicationMetrics.fromJSON);
    } else {
      streamMetrics.applications = [];
    }
    return streamMetrics;
  }

  static listFromJSON(input): Array<StreamMetrics> {
    if (Array.isArray(input)) {
      return input.map(StreamMetrics.fromJSON);
    }
    return [];
  }
}
