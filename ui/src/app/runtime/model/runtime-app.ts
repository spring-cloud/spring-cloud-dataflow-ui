import {RuntimeAppInstance} from './runtime-app-instance';
import {Page} from '../../shared/model/page';

/**
 * Runtime application model that corresponds to AppStatusResource from SCDF server.
 *
 * @author Ilayaperumal Gopinathan
 */
export class RuntimeApp {
    public deploymentId: String;
    public state: String;
    public instances: any;
    public appInstances: RuntimeAppInstance[];

    constructor(
        deploymentId: String,
        state: String,
        instances: any,
        appInstances: RuntimeAppInstance[]) {
        this.deploymentId = deploymentId;
        this.state = state;
        this.instances = instances;
        this.appInstances = appInstances;
    }
}
