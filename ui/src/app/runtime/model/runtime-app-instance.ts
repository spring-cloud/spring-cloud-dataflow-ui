/**
 * Runtime application instance model that corresponds to application instance of a running application.
 *
 * @author Ilayaperumal Gopinathan
 */
export class RuntimeAppInstance {
    public instanceId: String;
    public state: String;
    public attributes: any;

    constructor(
        instanceId: String,
        state: String,
        attributes: any) {
        this.instanceId = instanceId;
        this.state = state;
        this.attributes = attributes;
    }
}
