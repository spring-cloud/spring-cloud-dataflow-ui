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

/**
 * Extension to ConfigurationMetadataProperty adding value field which
 * makes in easier to use metadata as domain and data object as i.e.
 * dialogs and structures need to track what user set.
 */
export class ValuedConfigurationMetadataProperty extends ConfigurationMetadataProperty {

  value: string;

  static parse(input) {
    return ConfigurationMetadataProperty.parse(input) as ValuedConfigurationMetadataProperty;
  }
}

export class ConfigurationMetadataPropertyList {
  static parse(input): Array<ConfigurationMetadataProperty> {
    if (input) {
      return input.map(ConfigurationMetadataProperty.parse);
    }
    return [];
  }
}

export class ValuedConfigurationMetadataPropertyList {
  static parse(input): Array<ValuedConfigurationMetadataProperty> {
    if (input) {
      return input.map(ValuedConfigurationMetadataProperty.parse);
    }
    return [];
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
