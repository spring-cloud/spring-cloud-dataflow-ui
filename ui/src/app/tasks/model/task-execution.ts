import { Moment } from 'moment';
import * as moment from 'moment';
import { Page } from '../../shared/model/page';
import { Task } from 'protractor/built/taskScheduler';
import { Serializable } from '../../shared/model/serialization/serializable.model';

export class TaskExecution {

  public executionId: number;
  public exitCode: number;
  public taskName: string;
  public startTime: Moment;
  public endTime: Moment;
  public exitMessage: string;
  public arguments: string[];
  public jobExecutionIds: number[];
  public errorMessage: string;
  public externalExecutionId: string;

  constructor(executionId: number,
              exitCode: number,
              taskName: string,
              startTime: Moment,
              endTime: Moment,
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
      jsonItem.startTime ? moment.utc(jsonItem.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]') : null,
      jsonItem.endTime ? moment.utc(jsonItem.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]') : null,
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
