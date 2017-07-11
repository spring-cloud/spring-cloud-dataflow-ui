export class StreamDefinition {
  public name: String;
  public dslText: String;
  public status: String;

  constructor(
      name: String,
      dslText: String,
      status: String) {
    this.name = name;
    this.dslText = dslText;
    this.status = status
  }
}
