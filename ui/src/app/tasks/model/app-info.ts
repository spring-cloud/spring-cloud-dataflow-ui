export class AppInfo {

  public name: string;
  public type: string;
  public uri: string;
  public options: AppInfoOptions[];
  public shortDescription: string;

  constructor() {
  }
}

export class AppInfoOptions {

  public id: string;
  public name: string;
  public type: string;
  public description: string;
  public shortDescription: string;
  public defaultValue: string;

  constructor() {
  }

}
