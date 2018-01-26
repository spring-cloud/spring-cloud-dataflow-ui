import { Serializable } from '../serialization/serializable.model';

/**
 * Holds dependency information of a library used by Spring Cloud Dataflow.
 *
 * @author Gunnar Hillert
 */
export class Dependency implements Serializable<Dependency> {

  public name: string;
  public version: string;
  public url: string;
  public checksumSha1: string;
  public checksumSha256: string;

  public deserialize(input) {
    this.name = input.name;
    this.version = input.version;
    this.url = input.url;
    this.checksumSha1 = input.checksumSha1;
    this.checksumSha256 = input.checksumSha256;
    return this;
  }
}
