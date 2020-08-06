import { Serializable } from '..';

export class MonitoringDashboardInfo implements Serializable<MonitoringDashboardInfo> {

  public url = '';
  public token = '';
  public refreshInterval = 10;
  public source = '';

  public reset() {
    this.url = '';
    this.token = '';
    this.source = '';
  }

  public deserialize(input) {
    if (input) {
      this.url = input['url'] ? input['url'] : '';
      this.token = input['token'] ? input['token'] : '';
      this.source = input['source'] ? input['source'] : '';
      this.refreshInterval = ((typeof input['refreshInterval'] === 'number') ? input['refreshInterval'] : 10);
      if (this.url[this.url.length - 1] === '/') {
        this.url = this.url.substr(0, this.url.length - 1);
      }
    }
    return this;
  }


}
