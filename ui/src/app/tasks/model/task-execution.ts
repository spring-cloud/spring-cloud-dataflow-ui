import { Page } from '../../shared/model/page';
import { DateTime } from 'luxon';

export class TaskExecution {

  public executionId: number;
  public exitCode: number;
  public taskName: string;
  public startTime: DateTime;
  public endTime: DateTime;
  public exitMessage: string;
  public arguments: string[];
  public jobExecutionIds: number[];
  public errorMessage: string;
  public externalExecutionId: string;

  constructor(executionId: number,
              exitCode: number,
              taskName: string,
              startTime: DateTime,
              endTime: DateTime,
              exitMessage: string,
              args: string[], // arguments would be restricted name
              jobExecutionIds: number[],
              errorMessage: string,
              externalExecutionId: string) {
    this.executionId = executionId;
    this.exitCode = exitCode;
    this.taskName = taskName;
    this.startTime = startTime;
    this.endTime = endTime;
    this.exitMessage = exitMessage;
    this.arguments = args;
    this.jobExecutionIds = jobExecutionIds;
    this.errorMessage = errorMessage;
    this.externalExecutionId = externalExecutionId;
  }

  static fromJSON(jsonItem): TaskExecution {
    return new TaskExecution(
      jsonItem.executionId,
      jsonItem.exitCode,
      jsonItem.taskName,
      jsonItem.startTime ? DateTime.fromISO(jsonItem.startTime) : null,
      jsonItem.endTime ? DateTime.fromISO(jsonItem.endTime) : null,
      jsonItem.exitMessage,
      jsonItem.arguments,
      jsonItem.jobExecutionIds,
      jsonItem.errorMessage,
      jsonItem.externalExecutionId);
  }

  static pageFromJSON(input): Page<TaskExecution> {
    const page = Page.fromJSON<TaskExecution>(input);
    if (input && input._embedded && input._embedded.taskExecutionResourceList) {
      page.items = input._embedded.taskExecutionResourceList.map(TaskExecution.fromJSON);
    }
    return page;
  }

}
