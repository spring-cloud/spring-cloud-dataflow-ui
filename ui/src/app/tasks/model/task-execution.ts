import { Moment } from 'moment';

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

  constructor(
      executionId: number,
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
}
