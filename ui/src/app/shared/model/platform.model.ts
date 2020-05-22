export class Platform {
  public name: string;
  public type: string;
  public description: string;
  public options: Array<any>;

  static parse(input): Platform {
    const platform = new Platform();
    platform.name = input.name;
    platform.type = input.type;
    platform.description = input.description;
    platform.options = input.options;
    return platform;
  }
}

export class PlatformList {
  static parse(input): Array<Platform> {
    if (input && Array.isArray(input)) {
      return input.map(Platform.parse);
    }
    return [];
  }
}

export class PlatformTaskList {
  static parse(input): Array<Platform> {
    if (input && input._embedded && input._embedded.launcherResourceList) {
      return input._embedded.launcherResourceList.map(Platform.parse);
    }
    return [];
  }
}
