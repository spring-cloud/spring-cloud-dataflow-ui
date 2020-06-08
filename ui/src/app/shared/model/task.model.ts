import { Page } from './page.model';

export class Task {
  name: string;
  description: string;
  dslText: string;
  composed: boolean;
  status: string;
  composedTaskElement: boolean;

  static parse(input) {
    const task = new Task();
    task.name = input.name;
    task.dslText = input.dslText;
    task.composed = input.composed;
    task.status = input.status;
    task.composedTaskElement = input.composedTaskElement;
    task.description = input.description || '';

    return task;
  }

  statusColor() {
    switch (this.status) {
      case 'COMPLETE':
      case 'SUCCESS':
        return 'success';
      case 'ERROR':
        return 'danger';
      case 'RUNNING':
        return 'warning';
      default:
        return 'info';
    }
  }
}

export class TaskPage extends Page<Task> {
  public static parse(input): Page<Task> {
    const page = Page.fromJSON<Task>(input);
    if (input && input._embedded && input._embedded.taskDefinitionResourceList) {
      page.items = input._embedded.taskDefinitionResourceList.map(Task.parse);
    }
    return page;
  }
}
