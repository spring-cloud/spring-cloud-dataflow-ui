export interface Serializable<T> {
  deserialize(inputJson: Object): T;
}