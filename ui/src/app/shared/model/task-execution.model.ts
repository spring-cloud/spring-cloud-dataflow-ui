import {DateTime} from 'luxon';
import {Page} from './page.model';

interface hrefObj {
  href: string;
}

interface TaskExecutionLinks {
  self: hrefObj;
  'tasks/logs': hrefObj;
}

export class TaskExecution {
  executionId: number;
  exitCode: number;
  taskName: string;
  status: string;
  startTime: DateTime;
  endTime: DateTime;
  exitMessage: string;
  arguments: string[];
  jobExecutionIds: number[];
  errorMessage: string;
  externalExecutionId: string;
  taskExecutionStatus: string;
  parentExecutionId: number;
  resourceUrl: string;
  appProperties: any;
  deploymentProperties: {[key: string]: string};
  _links: TaskExecutionLinks;

  static parse(input: any): TaskExecution {
    const execution = new TaskExecution();
    execution.executionId = input?.executionId;
    execution.exitCode = input?.exitCode;
    execution.taskName = input?.taskName;
    execution.status = input?.exitCode === 0 ? 'SUCCESS' : 'ERROR';
    execution.startTime = input?.startTime ? DateTime.fromISO(input.startTime) : null;
    execution.endTime = input?.endTime ? DateTime.fromISO(input.endTime) : null;
    execution.exitMessage = input?.exitMessage;
    execution.arguments = input?.arguments || [];
    execution.jobExecutionIds = input?.jobExecutionIds || [];
    execution.errorMessage = input?.errorMessage;
    execution.taskExecutionStatus = input?.taskExecutionStatus;
    execution.externalExecutionId = input?.externalExecutionId;
    execution.parentExecutionId = input?.parentExecutionId;
    execution.resourceUrl = input?.resourceUrl;
    execution.appProperties = input?.appProperties;
    execution.deploymentProperties = input?.deploymentProperties;
    execution._links = input?._links;
    return execution;
  }

  getArgumentsToArray(): Array<any> {
    return (this.arguments || []).map(arg => {
      const index = arg.indexOf('=');
      if (index === -1) {
        return [arg];
      }
      return [arg.substring(0, index), arg.substring(index + 1)];
    });
  }

  getAppPropertiesToArray(): Array<any> {
    if (this.appProperties && Object.keys(this.appProperties).length > 0) {
      return Object.keys(this.appProperties).map(key => ({
        key,
        value: this.appProperties[key]
      }));
    }
    return [];
  }

  getDeploymentPropertiesToArray(): Array<[key: string, value: string]> {
    if (this.deploymentProperties && Object.keys(this.deploymentProperties).length > 0) {
      return Object.keys(this.deploymentProperties).map(key => [key, this.deploymentProperties[key]]);
    }
    return [];
  }

  labelStatusClass(): string {
    switch (this.status) {
      case 'COMPLETE':
      case 'SUCCESS':
        return 'label label-task complete';
      case 'ERROR':
        return 'label label-task error';
      case 'RUNNING':
        return 'label label-task running';
      default:
        return 'label label-task unknown';
    }
  }
}

export class TaskExecutionPage extends Page<TaskExecution> {
  static parse(input: any): Page<TaskExecution> {
    const page = Page.fromJSON<TaskExecution>(input);
    if (input && input._embedded && input._embedded.taskExecutionResourceList) {
      page.items = input._embedded.taskExecutionResourceList.map(TaskExecution.parse);
    }
    return page;
  }
}
