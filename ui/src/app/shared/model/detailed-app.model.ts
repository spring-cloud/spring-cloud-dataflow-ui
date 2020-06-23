import { App, ApplicationType } from './app.model';

export class Deprecation {

  level: string;
  reason: string;
  replacement: string;

  static parse(input) {
    const deprecation = new Deprecation();
    deprecation.level = input.level ? input.level : undefined;
    deprecation.reason = input.reason ? input.reason : undefined;
    deprecation.replacement = input.replacement ? input.replacement : undefined;
    return deprecation;
  }
}

export class ConfigurationMetadataProperty {

  id: string;
  name: string;
  type: string;
  description: string;
  shortDescription: string;
  defaultValue: string;
  deprecation: Deprecation;
  sourceType: string;
  isDeprecated: boolean;

  static parse(input) {
    const config = new ConfigurationMetadataProperty();
    config.id = input.id ? input.id : undefined;
    config.name = input.name ? input.name : undefined;
    config.type = input.type ? input.type : undefined;
    config.description = input.description ? input.description : undefined;
    config.shortDescription = input.shortDescription ? input.shortDescription : undefined;
    config.defaultValue = input.defaultValue ? input.defaultValue : undefined;
    config.deprecation = input.deprecation ? Deprecation.parse(input.deprecation) : undefined;
    config.sourceType = input.sourceType ? input.sourceType : undefined;
    config.isDeprecated = input.deprecated ? input.deprecated : false;
    return config;
  }
}

export class DetailedApp extends App {
  options: ConfigurationMetadataProperty[];

  static parse(input): DetailedApp {
    const app: DetailedApp = new DetailedApp();
    app.name = input.name;
    app.type = input.type as ApplicationType;
    app.uri = input.uri;
    app.version = input.version;
    app.versions = input.versions;
    app.defaultVersion = input.defaultVersion;
    if (input.options) {
      app.options = [];
      for (const option of input.options) {
        app.options.push(ConfigurationMetadataProperty.parse(option));
      }
    }
    return app;
  }

}
