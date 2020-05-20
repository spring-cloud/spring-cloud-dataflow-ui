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

  public static parse(input) {
    const app = new App();
    app.name = input.name;
    app.type = input.type as ApplicationType;
    app.uri = input.uri;
    app.version = input.version;
    app.defaultVersion = input.defaultVersion;
    return app;
  }

  typeColor() {
    switch (this.type.toString()) {
      case 'source':
        return 'app source';
      case 'sink':
        return 'app sink';
      case 'processor':
        return 'app processor';
      case 'task':
        return 'app task';
      default:
      case 'app':
        return 'app app';
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
