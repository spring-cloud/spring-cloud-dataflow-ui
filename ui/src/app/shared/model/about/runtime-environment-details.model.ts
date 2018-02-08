import { Serializable } from '../serialization/serializable.model';
import { ObjectUtils } from '../../support/object.utils';

/**
 * Provides runtime environment details for either a deployer or task launcher.
 *
 * @author Gunnar Hillert
 */
export class RuntimeEnvironmentDetails implements Serializable<RuntimeEnvironmentDetails> {

  /**
   * The implementation version of this deployer.
   */
  public deployerImplementationVersion: string;

  /**
   * The name of this deployer (could be simple class name).
   */
  public deployerName: string;

  /**
   * The SPI version used by this deployer.
   */
  public deployerSpiVersion: string;

  /**
   * The Java version used by this deployer.
   */
  public javaVersion: string;

  /**
   * The deployment platform API for this deployer.
   */
  public platformApiVersion: string;

  /**
   * The client library version used by this deployer.
   */
  public platformClientVersion: string;

  /**
   * The version running on the host of the platform used by this deployer.
   */
  public platformHostVersion: string;

  /**
   * Platform specific properties
   */
  public platformSpecificInfo = new Map<string, string>();

  /**
   * The deployment platform for this deployer.
   */
  public platformType: string;

  /**
   * The Spring Boot version used by this deployer.
   */
  public springBootVersion: string;

  /**
   * The Spring Framework version used by this deployer.
   */
  public springVersion: string;

  public deserialize(input) {
    this.deployerImplementationVersion = input.deployerImplementationVersion;
    this.deployerName = input.deployerName;
    this.deployerSpiVersion = input.deployerSpiVersion;
    this.javaVersion = input.javaVersion;
    this.platformApiVersion = input.platformApiVersion;
    this.platformClientVersion = input.platformClientVersion;
    this.platformHostVersion = input.platformHostVersion;
    this.platformSpecificInfo = ObjectUtils.convertJsonToMap(input.platformSpecificInfo);
    this.platformType = input.platformType;
    this.springBootVersion = input.springBootVersion;
    this.springVersion = input.springVersion;
    return this;
  }
}
