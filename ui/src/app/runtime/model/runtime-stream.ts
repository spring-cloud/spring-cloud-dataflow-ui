import { Page } from '../../shared/model';
import { RuntimeApp } from './runtime-app';

/**
 * Runtime stream model.
 *
 * @author Damien Vitrac
 */
export class RuntimeStream {

  public name: string;
  public apps: RuntimeApp[];

  constructor(name: string,
              apps: RuntimeApp[]) {
    this.name = name;
    this.apps = apps;
  }

  public static pageFromJSON(input): Page<RuntimeStream> {
    const page = Page.fromJSON<RuntimeStream>(input);
    if (input && input._embedded && input._embedded.streamStatusResourceList) {
      page.items = input._embedded.streamStatusResourceList.map((item) => {
        if (!!item.applications._embedded && !!item.applications._embedded.appStatusResourceList) {
          item.apps = item.applications._embedded.appStatusResourceList.map((it) => {
            return RuntimeApp.fromJSON(it);
          });
        } else {
          item.apps = [];
        }
        return item;
      });
    }
    return page;
  }
}
