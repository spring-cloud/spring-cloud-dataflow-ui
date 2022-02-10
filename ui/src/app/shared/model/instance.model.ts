import {AppStatus} from './metrics.model';

export class Instance {
  name: string;
  instanceCount: number;
  isScaling = false;

  constructor(name: string, instanceCount: number, isScaling: boolean) {
    this.name = name;
    this.instanceCount = instanceCount;
    this.isScaling = isScaling;
  }

  static fromAppStatus(appStatus: AppStatus): Instance {
    return new Instance(appStatus.name, appStatus.instances.length, false);
  }
}
