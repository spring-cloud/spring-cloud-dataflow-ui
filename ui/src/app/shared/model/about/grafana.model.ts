import { Serializable } from '..';

/**
 * Contains meta data about grafana.
 *
 * @author Damien Vitrac
 */
export class GrafanaInfo implements Serializable<GrafanaInfo> {

  public url = '';
  public token = '';

  public reset() {
    this.url = '';
    this.token = '';
  }

  public deserialize(input) {
    if (input) {
      this.url = input['url'] ? input['url'] : '';
      this.token = input['token'] ? input['token'] : '';
    }
    return this;
  }


}
