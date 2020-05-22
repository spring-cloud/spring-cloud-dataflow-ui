import { DateTime } from 'luxon';
import { Page } from './page.model';

export class TaskExecution {

  executionId: number;
  exitCode: number;
  taskName: string;
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
  appProperties: object;
  deploymentProperties: object;

  static parse(input) {
    const execution = new TaskExecution();
    execution.executionId = input?.executionId;
    execution.exitCode = input?.exitCode;
    execution.taskName = input?.taskName;
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
    return execution;
  }

  getArgumentsToArray(): Array<any> {
    return (this.arguments || []).map((arg) => arg.split('='));
  }

  getAppPropertiesToArray(): Array<any> {
    if (this.appProperties && Object.keys(this.appProperties).length > 0) {
      return Object.keys(this.appProperties).map((key) => {
        return {
          key,
          value: this.appProperties[key]
        };
      });
    }
    return [];
  }

  getDeploymentPropertiesToArray(): Array<any> {
    if (this.deploymentProperties && Object.keys(this.deploymentProperties).length > 0) {
      return Object.keys(this.deploymentProperties).map((key) => {
        return {
          key,
          value: this.deploymentProperties[key]
        };
      });
    }
    return [];
  }
}

export class TaskExecutionPage extends Page<TaskExecution> {
  static parse(input): Page<TaskExecution> {
    const page = Page.fromJSON<TaskExecution>(input);
    if (input && input._embedded && input._embedded.taskExecutionResourceList) {
      page.items = input._embedded.taskExecutionResourceList.map(TaskExecution.parse);
    }
    return page;
  }
}
