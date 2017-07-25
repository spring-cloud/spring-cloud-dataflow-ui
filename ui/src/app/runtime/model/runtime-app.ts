import {RuntimeAppInstance} from './runtime-app-instance';
import {Page} from '../../shared/model/page';

/**
 * Runtime application model that corresponds to AppStatusResource from SCDF server.
 *
 * @author Ilayaperumal Gopinathan
 */
export class RuntimeApp {
    public deploymentId: String;
    public status: String;
    public appInstances: Page<RuntimeAppInstance>;

    constructor(
        deploymentId: String,
        status: String,
        appInstances: Page<RuntimeAppInstance>) {
        this.deploymentId = deploymentId;
        this.status = status;
        this.appInstances = appInstances
    }
}
