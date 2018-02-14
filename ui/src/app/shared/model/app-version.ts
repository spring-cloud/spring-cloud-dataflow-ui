import { Selectable } from '../../shared/model/selectable';
import { ApplicationType } from './application-type';
import { Serializable } from '../../shared/model';

/**
 * Represents an App Version
 *
 * @author Damien Vitrac
 */
export class AppVersion implements Serializable<AppVersion> {
  public version: string;
  public uri: string;
  public defaultVersion: boolean;

  constructor(
    version?: string,
    uri?: string,
    defaultVersion?: boolean ) {
    this.version = version;
    this.uri = uri;
    this.defaultVersion = defaultVersion;
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding AppRegistration object, with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    this.version = input.version;
    this.uri = input.uri;
    this.defaultVersion = input.defaultVersion as boolean;
    return this;
  }

}
