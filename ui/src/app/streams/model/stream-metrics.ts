export const TYPE = 'spring.cloud.dataflow.stream.app.type';
export const INSTANCE_COUNT = 'spring.cloud.stream.instanceCount';

/**
 * StreamStatuses and related model classes
 *
 * @author Alex Boyko
 */
export class InstanceStatus {
  guid: string;
  index: number;
  state: string;

  static fromJSON(input): InstanceStatus {
    const instanceStatus = new InstanceStatus();
    instanceStatus.guid = input.guid;
    instanceStatus.index = input.index;
    instanceStatus.state = input.state;
    return instanceStatus;
  }

}

export class StreamStatus {
  name: string;
  id: string;
  instances: InstanceStatus[];

  static fromJSON(input) {
    const streamStatus = new StreamStatus();
    streamStatus.id = input.id;
    streamStatus.name = input.name;
    if (Array.isArray(input.instances)) {
      streamStatus.instances = input.instances.map(InstanceStatus.fromJSON);
    } else {
      streamStatus.instances = [];
    }
    return streamStatus;
  }
}

export class StreamStatuses {
  name: string;
  applications: StreamStatus[];

  static fromJSON(input): StreamStatuses {
    const streamStatuses = new StreamStatuses();
    streamStatuses.name = input.name;
    if (Array.isArray(input.applications)) {
      streamStatuses.applications = input.applications.map(StreamStatus.fromJSON);
    } else {
      streamStatuses.applications = [];
    }
    return streamStatuses;
  }

  static listFromJSON(input): Array<StreamStatuses> {
    if (Array.isArray(input)) {
      return input.map(StreamStatuses.fromJSON);
    }
    return [];
  }
}
