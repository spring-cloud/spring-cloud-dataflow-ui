import { App } from './app.model';
import { ConfigurationMetadataProperty, ValuedConfigurationMetadataProperty } from './detailed-app.model';
import { Page } from './page.model';
import { TaskExecution } from './task-execution.model';

export class Task {
  name: string;
  description: string;
  dslText: string;
  composed: boolean;
  status: string;
  composedTaskElement: boolean;
  lastTaskExecution: TaskExecution;

  static parse(input) {
    const task = new Task();
    task.name = input.name;
    task.dslText = input.dslText;
    task.composed = input.composed;
    task.status = input.status;
    task.composedTaskElement = input.composedTaskElement;
    task.description = input.description || '';
    if (input.lastTaskExecution) {
      task.lastTaskExecution = TaskExecution.parse(input.lastTaskExecution);
    }
    return task;
  }

  labelStatusClass() {
    switch (this.status) {
      case 'COMPLETE':
      case 'SUCCESS':
        return 'label label-task complete ';
      case 'ERROR':
        return 'label label-task error';
      case 'RUNNING':
        return 'label label-task running';
      default:
        return 'label label-task unknown';
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

export class TaskLaunchConfig {

  /** Task name */
  id: string;

  /** Expected platform type */
  platform: {
    id: string;
    name: string;
    form: string;
    type: string;
    defaultValue: string|null;
    values: {
      key: string;
      name: string;
      type: string;
      options: ConfigurationMetadataProperty[];
    }[];
  };

  /** Expected deployer type */
  deployers: {
    id: string;
    name: string;
    form: string;
    type: string;
    value: string|null;
    defaultValue: string|null;
    suffix: string;
  }[];

  /** Expected apps type */
  apps: {
    origin: string;
    name: string;
    type: string;
    version: string;
    versions: App[];
    options: ConfigurationMetadataProperty[];
    optionsState: {
      isLoading: boolean;
      isOnError: boolean;
      isInvalid: boolean;
    };
  }[];

  /** Ctr options metadata */
  ctr: ValuedConfigurationMetadataProperty[];

  constructor() {
  }
}
