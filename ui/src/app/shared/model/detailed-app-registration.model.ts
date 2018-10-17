import { ApplicationType } from '../../shared/model/application-type';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { Serializable } from '../../shared/model';

/**
 * Provides deprecation information for a specific configuration metadata property provided by an application.
 */
export class Deprecation implements Serializable<Deprecation> {

  public level: string;
  public reason: string;
  public replacement: string;

  /**
   * For a given JSON data object, this method
   * will populate the corresponding {@link Deprecation}
   * object, with the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    this.level = input.level ? input.level : undefined;
    this.reason = input.reason ? input.reason : undefined;
    this.replacement = input.replacement ? input.replacement : undefined;
    return this;
  }
}

/**
 * Provides information for a specific configuration metadata property provided by an application.
 */
export class ConfigurationMetadataProperty implements Serializable<ConfigurationMetadataProperty> {

  public id: string;
  public name: string;
  public type: string;
  public description: string;
  public shortDescription: string;
  public defaultValue: string;
  public deprecation: Deprecation;
  public sourceType: string;
  public isDeprecated: boolean;

  /**
   * For a given JSON data object, this method
   * will populate the corresponding {@link ConfigurationMetadataProperty}
   * object, with the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    this.id = input.id ? input.id : undefined;
    this.name = input.name ? input.name : undefined;
    this.type = input.type ? input.type : undefined;
    this.description = input.description ? input.description : undefined;
    this.shortDescription = input.shortDescription ? input.shortDescription : undefined;
    this.defaultValue = input.defaultValue ? input.defaultValue : undefined;
    this.deprecation = input.deprecation ? new Deprecation().deserialize(input.deprecation) : undefined;
    this.sourceType = input.sourceType ? input.sourceType : undefined;
    this.isDeprecated = input.deprecated ? input.deprecated : false;
    return this;
  }
}

/**
 * The DetailedAppRegistration provides additional information compared
 * to the base {@link AppRegistration} such as options
 * ({@link ConfigurationMetadataProperty}).
 *
 * @author Gunnar Hillert
 */
export class DetailedAppRegistration extends AppRegistration implements Serializable<DetailedAppRegistration> {

  public options: ConfigurationMetadataProperty[];

  constructor(name?: string, type?: ApplicationType, uri?: string) {
    super(name, type, uri);
  }

  static fromJSON(input): DetailedAppRegistration {
    const detailed = new DetailedAppRegistration();

    return new DetailedAppRegistration().deserialize(input);
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding AppRegistration object, with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    super.deserialize(input);

    if (input.options) {
      this.options = [];
      for (const option of input.options) {
        this.options.push(new ConfigurationMetadataProperty().deserialize(option));
      }
    }
    return this;
  }

}
