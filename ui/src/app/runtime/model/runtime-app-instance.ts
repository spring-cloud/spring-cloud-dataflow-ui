/**
 * Runtime application instance model that corresponds to application instance of a running application.
 *
 * @author Ilayaperumal Gopinathan
 */
export class RuntimeAppInstance {
    public instanceId: string;
    public state: string;
    public attributes: any;

    constructor(
        instanceId: string,
        state: string,
        attributes: any) {
        this.instanceId = instanceId;
        this.state = state;
        this.attributes = attributes;
    }
}
