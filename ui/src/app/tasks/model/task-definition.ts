import {Page} from 'src/app/shared/model';

export class TaskDefinition {

  public name: string;

  public description: string;

  public dslText: string;

  public composed: boolean;

  public status: string;

  public composedTaskElement: boolean;

  constructor(name: string, dslText: string, description: string, composed: boolean, status: string, composedTaskElement: boolean) {
    this.name = name;
    this.dslText = dslText;
    this.composed = composed;
    this.status = status;
    this.description = description ? description : '';
    this.composedTaskElement = composedTaskElement;
  }

  static fromJSON(input): TaskDefinition {
    return new TaskDefinition(input.name, input.dslText, input.description, input.composed, input.status, input.composedTaskElement);
  }

  static pageFromJSON(input): Page<TaskDefinition> {
    const page = Page.fromJSON<TaskDefinition>(input);
    if (input && input._embedded && input._embedded.taskDefinitionResourceList) {
      page.items = input._embedded.taskDefinitionResourceList.map(TaskDefinition.fromJSON);
    }
    return page;
  }
}
