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
  deploymentId: string;
  state: string;
  instances: InstanceStatus[];

  static fromJSON(input) {
    const streamStatus = new StreamStatus();
    streamStatus.deploymentId = input.deploymentId;
    streamStatus.state = input.state;
    streamStatus.name = input.name;
    if (input && input.instances && input.instances._embedded && input.instances._embedded.appInstanceStatusResourceList &&
      Array.isArray(input.instances._embedded.appInstanceStatusResourceList)) {
      streamStatus.instances = input.instances._embedded.appInstanceStatusResourceList.map(InstanceStatus.fromJSON);
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
    if (input.applications && input.applications._embedded && input.applications._embedded.appStatusResourceList &&
      Array.isArray(input.applications._embedded.appStatusResourceList)) {
      streamStatuses.applications = input.applications._embedded.appStatusResourceList.map(StreamStatus.fromJSON);
    } else {
      streamStatuses.applications = [];
    }
    return streamStatuses;
  }

  static listFromJSON(input): Array<StreamStatuses> {
    if (input && input._embedded && input._embedded.streamStatusResourceList
      && Array.isArray(input._embedded.streamStatusResourceList)) {
      return input._embedded.streamStatusResourceList.map(StreamStatuses.fromJSON);
    }
    return [];
  }
}
