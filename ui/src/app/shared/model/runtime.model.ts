import {Page} from './page.model';

export class RuntimeAppInstance {
  instanceId: string;
  state: string;
  attributes: any;
  static parse(input: any): RuntimeAppInstance {
    const instance = new RuntimeAppInstance();
    instance.instanceId = input.instanceId;
    instance.state = input.state.toUpperCase();
    instance.attributes = input.attributes;
    return instance;
  }
  stateColor(): string {
    switch (this.state) {
      case 'DEPLOYED':
        return 'label label-runtime deployed';
      case 'ERROR':
      case 'FAILED':
        return 'label label-runtime failed';
      default:
        return 'label label-runtime unknown';
    }
  }
}

export class RuntimeApp {
  deploymentId: string;
  state: string;
  instances: any;
  appInstances: any;
  static parse(input: any): RuntimeApp {
    const runtimeApp = new RuntimeApp();
    runtimeApp.deploymentId = input.deploymentId;
    runtimeApp.state = input.state.toUpperCase();
    runtimeApp.instances = input.instances;
    runtimeApp.appInstances = [];
    if (!!input.instances && !!input.instances._embedded && !!input.instances._embedded.appInstanceStatusResourceList) {
      runtimeApp.appInstances = input.instances._embedded.appInstanceStatusResourceList.map(RuntimeAppInstance.parse);
    }
    return runtimeApp;
  }

  stateColor(): string {
    switch (this.state) {
      case 'DEPLOYED':
        return 'label label-runtime deployed';
      case 'ERROR':
      case 'FAILED':
        return 'label label-runtime failed';
      default:
        return 'label label-runtime unknown';
    }
  }
}

export class RuntimeAppPage extends Page<RuntimeApp> {
  public static parse(input: any): RuntimeAppPage {
    const page = Page.fromJSON<RuntimeApp>(input);
    if (input && input._embedded && input._embedded.appStatusResourceList) {
      page.items = input._embedded.appStatusResourceList.map(item => {
        if (
          !!item.instances &&
          !!item.instances._embedded &&
          !!item.instances._embedded.appInstanceStatusResourceList
        ) {
          item.appInstances = item.instances._embedded.appInstanceStatusResourceList.map(RuntimeAppInstance.parse);
        } else {
          item.appInstances = [];
        }
        return item;
      });
    }
    return page;
  }
}

export class RuntimeStream {
  name: string;
  apps: RuntimeApp[];

  static parse(input: any): RuntimeStream {
    const runtimeStream = new RuntimeStream();
    runtimeStream.name = input.name;
    if (!!input.applications._embedded && !!input.applications._embedded.appStatusResourceList) {
      runtimeStream.apps = input.applications._embedded.appStatusResourceList.map(it => RuntimeApp.parse(it));
    } else {
      runtimeStream.apps = [];
    }
    return runtimeStream;
  }
}

export class RuntimeStreamPage extends Page<RuntimeStream> {
  static parse(input: any): Page<RuntimeStream> {
    const page = Page.fromJSON<RuntimeStream>(input);
    if (input && input._embedded && input._embedded.streamStatusResourceList) {
      page.items = input._embedded.streamStatusResourceList.map(RuntimeStream.parse);
    }
    return page;
  }
}
