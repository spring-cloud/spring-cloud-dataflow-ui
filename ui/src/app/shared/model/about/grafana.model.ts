import { Serializable } from '..';
import { isNumber } from 'util';

/**
 * Contains meta data about grafana.
 *
 * @author Damien Vitrac
 */
export class GrafanaInfo implements Serializable<GrafanaInfo> {

  public url = '';
  public token = '';
  public refreshInterval = 10;

  public reset() {
    this.url = '';
    this.token = '';
  }

  public deserialize(input) {
    if (input) {
      this.url = input['url'] ? input['url'] : '';
      this.token = input['token'] ? input['token'] : '';
      this.refreshInterval = isNumber(input['refreshInterval']) ? input['refreshInterval'] : 10;
    }
    return this;
  }


}
