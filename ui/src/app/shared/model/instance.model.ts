import {AppStatus} from '../model/metrics.model';

export class Instance {
  name: string;
  currentInstanceCount: number;
  instanceCount: number;
  isScaling = false;

  constructor(name: string, currentInstanceCount: number, instanceCount: number, isScaling: boolean) {
    this.name = name;
    this.currentInstanceCount = currentInstanceCount;
    this.instanceCount = instanceCount;
    this.isScaling = isScaling;
  }

  static fromAppStatus(appStatus: AppStatus): Instance {
    return new Instance(appStatus.name, appStatus.instances.length, appStatus.instances.length, false);
  }

  public isValid(): boolean {
    return this.instanceCount >= 0;
  }
}
