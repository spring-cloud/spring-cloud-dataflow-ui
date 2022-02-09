import {AppStatus} from '../model/metrics.model';

export class Instance {
  name: string;
  currentInstanceCount: number;
  instanceCount: number;
  isScaling = false;

  static fromAppStatus(appStatus: AppStatus): Instance {
    return {
      currentInstanceCount: appStatus.instances.length,
      instanceCount: appStatus.instances.length,
      name: appStatus.name
    } as Instance;
  }
}
