import { DateTimeUtils } from '../../shared/support/date-time.utils';
import { StepExecution } from './step-execution.model';
import { Page } from '../../shared/model/page';
import { DateTime } from 'luxon';

export class JobExecution {
  public name: string;
  public taskExecutionId: number;
  public jobInstanceId: number;
  public jobExecutionId: number;
  public startTime: DateTime;
  public endTime: DateTime;
  public stepExecutionCount: number;
  public status: string;
  public jobParametersString: string;
  public exitCode: string;
  public exitMessage: string;

  public stepExecutions: Array<StepExecution>;

  public restartable: boolean;
  public abandonable: boolean;
  public stoppable: boolean;
  public defined: boolean;

  constructor() {
    this.stepExecutions = [];
  }

  public get startTimeFormatted(): string {
    return DateTimeUtils.formatAsDateTime(this.startTime);
  }

  static fromJSON(input): JobExecution {
    const jobExecution: JobExecution = new JobExecution();
    jobExecution.name = input.name;
    jobExecution.startTime = DateTime.fromISO(input.jobExecution.startTime);
    jobExecution.stepExecutionCount = input.stepExecutionCount;
    jobExecution.status = input.jobExecution.status;
    jobExecution.jobExecutionId = input.jobExecution.id;
    jobExecution.taskExecutionId = input.taskExecutionId;
    jobExecution.jobInstanceId = input.jobExecution.jobInstance.id;
    jobExecution.restartable = input.restartable;
    jobExecution.abandonable = input.abandonable;
    jobExecution.stoppable = input.stoppable;
    jobExecution.defined = input.defined;
    if (input.jobExecution.endTime) {
      jobExecution.endTime = DateTime.fromISO(input.jobExecution.endTime);
    }
    if (input.jobExecution.exitStatus) {
      jobExecution.exitCode = input.jobExecution.exitStatus.exitCode;
      jobExecution.exitMessage = input.jobExecution.exitStatus.exitDescription;
    }
    jobExecution.jobParametersString = input.jobParametersString;
    if (input.jobExecution.stepExecutions) {
      jobExecution.stepExecutions = input.jobExecution.stepExecutions.map(StepExecution.fromJSON);
    }
    return jobExecution;
  }

  static fromThinJSON(input): JobExecution {
    const jobExecution: JobExecution = new JobExecution();
    jobExecution.name = input.name;
    jobExecution.startTime = DateTime.fromISO(input.startDateTime);
    jobExecution.stepExecutionCount = input.stepExecutionCount;
    jobExecution.status = input.status;
    jobExecution.jobExecutionId = input.executionId;
    jobExecution.taskExecutionId = input.taskExecutionId;
    jobExecution.jobInstanceId = input.instanceId;
    jobExecution.restartable = input.restartable;
    jobExecution.abandonable = input.abandonable;
    jobExecution.stoppable = input.stoppable;
    jobExecution.defined = input.defined;
    jobExecution.jobParametersString = input.jobParametersString;
    return jobExecution;
  }

  static pageFromJSON(input): Page<JobExecution> {
    const page = Page.fromJSON<JobExecution>(input);
    if (input && input._embedded) {
      if (input._embedded.jobExecutionResourceList) {
        page.items = input._embedded.jobExecutionResourceList.map(JobExecution.fromJSON);
      }
      if (input._embedded.jobExecutionThinResourceList) {
        page.items = input._embedded.jobExecutionThinResourceList.map(JobExecution.fromThinJSON);
      }
    }
    return page;
  }

}
