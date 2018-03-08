/**
 * Represents a Stream Deploy Config.
 *
 * @author Damien Vitrac
 */
export class StreamDeployConfig {

  skipper = false;

  id: string;

  platform: any;

  deployers: any;

  apps: any;

  constructor() {

  }

  platformExist(key: string): boolean {
    if (!key) {
      return true;
    }
    if (this.platform) {
      return this.platform.values.filter((a) => a.key === key).length > 0;
    }
    return false;
  }

}
