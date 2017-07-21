export class TaskDefinition {

  public name: string;
  public dslText: string;
  public composed: boolean;
  public status: string;

  constructor(
      name: string,
      dslText: string,
      composed: boolean,
      status: string) {
    this.name = name;
    this.dslText = dslText;
    this.composed = composed;
    this.status = status;
  }
}
