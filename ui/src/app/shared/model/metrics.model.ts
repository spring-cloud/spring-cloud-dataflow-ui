export const TYPE = 'spring.cloud.dataflow.stream.app.type';
export const INSTANCE_COUNT = 'spring.cloud.stream.instanceCount';

export class InstanceStatus {
  guid: string;
  index: number;
  state: string;

  static parse(input): InstanceStatus {
    const instanceStatus = new InstanceStatus();
    instanceStatus.guid = input.guid;
    instanceStatus.index = input.index;
    instanceStatus.state = input.state;
    return instanceStatus;
  }
}

export class AppStatus {
  name: string;
  deploymentId: string;
  state: string;
  instances: InstanceStatus[];

  static parse(input) {
    const appStatus = new AppStatus();
    appStatus.deploymentId = input.deploymentId;
    appStatus.state = input.state;
    appStatus.name = input.name;
    if (input && input.instances && input.instances._embedded && input.instances._embedded.appInstanceStatusResourceList &&
      Array.isArray(input.instances._embedded.appInstanceStatusResourceList)) {
      appStatus.instances = input.instances._embedded.appInstanceStatusResourceList.map(InstanceStatus.parse);
    } else {
      appStatus.instances = [];
    }
    return appStatus;
  }
}

export class StreamStatus {
  name: string;
  applications: AppStatus[];

  static parse(input): StreamStatus {
    const streamStatus = new StreamStatus();
    streamStatus.name = input.name;
    if (input.applications && input.applications._embedded && input.applications._embedded.appStatusResourceList &&
      Array.isArray(input.applications._embedded.appStatusResourceList)) {
      streamStatus.applications = input.applications._embedded.appStatusResourceList.map(AppStatus.parse);
    } else {
      streamStatus.applications = [];
    }
    return streamStatus;
  }
}

export class StreamStatuses {
  static parse(input): Array<StreamStatus> {
    if (input && input._embedded && input._embedded.streamStatusResourceList
      && Array.isArray(input._embedded.streamStatusResourceList)) {
      return input._embedded.streamStatusResourceList.map(StreamStatus.parse);
    }
    return [];
  }
}
