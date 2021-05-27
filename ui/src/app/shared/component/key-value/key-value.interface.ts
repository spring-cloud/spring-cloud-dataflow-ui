export interface KeyValueValidators {
  key: Array<(control) => any>;

  value: Array<(control) => any>;
}
