import { Page } from 'src/app/shared/model';

export class TaskDefinition {

  public name: string;

  public dslText: string;

  public composed: boolean;

  public status: string;

  constructor(name: string, dslText: string, composed: boolean, status: string) {
    this.name = name;
    this.dslText = dslText;
    this.composed = composed;
    this.status = status;
  }

  static fromJSON(input): TaskDefinition {
    return new TaskDefinition(input.name, input.dslText, input.composed, input.status);
  }

  static pageFromJSON(input): Page<TaskDefinition> {
    const page = Page.fromJSON<TaskDefinition>(input);
    if (input && input._embedded && input._embedded.taskDefinitionResourceList) {
      page.items = input._embedded.taskDefinitionResourceList.map(TaskDefinition.fromJSON);
    }
    return page;
  }

}
