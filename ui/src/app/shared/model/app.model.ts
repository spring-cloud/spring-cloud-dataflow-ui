import { Page } from './page.model';

export enum ApplicationType {
  app,
  source,
  processor,
  sink,
  task
}

export namespace ApplicationType {
  export function getKeys(): number[] {
    return Object.keys(ApplicationType).filter(isNumber).map(value => Number(value));
  }

  function isNumber(element, index, array) {
    return !isNaN(element);
  }
}

export class App {
  name: string;
  type: ApplicationType;
  uri: string;
  metaDataUri: string;
  version: string;
  defaultVersion: boolean;
  versions: Array<string>;

  public static parse(input) {
    const app = new App();
    app.name = input.name;
    app.type = input.type as ApplicationType;
    app.uri = input.uri;
    app.version = input.version;
    app.defaultVersion = input.defaultVersion;
    app.versions = input.versions;
    return app;
  }

  labelTypeClass() {
    switch ((this.type || '').toString()) {
      case 'source':
        return 'label label-app source';
      case 'sink':
        return 'label label-app sink';
      case 'processor':
        return 'label label-app processor';
      case 'task':
        return 'label label-app task';
      default:
      case 'app':
        return 'label label-app app';
    }
  }
}

export class AppPage extends Page<App> {
  public static parse(input): Page<App> {
    const page = Page.fromJSON<App>(input);
    if (input && input._embedded && input._embedded.appRegistrationResourceList) {
      page.items = input._embedded.appRegistrationResourceList.map(App.parse);
    }
    return page;
  }
}
