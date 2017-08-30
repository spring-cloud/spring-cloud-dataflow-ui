/**
 * Interface to be implemented by model classes to ensure
 * deserialization of JSON data.
 *
 * @author Gunnar Hillert
 */
export interface Serializable<T> {
  deserialize(inputJson: Object): T;
}
