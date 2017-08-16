import { Moment } from 'moment';
import { DateTimeUtils } from '../../shared/support/date-time.utils';
import { StepExecution } from './step-execution.model';

export class JobExecution {
  public name: string;
  public taskExecutionId: number;
  public jobInstanceId: number;
  public jobExecutionId: number;
  public startTime: Moment;
  public endTime: Moment;
  public stepExecutionCount: number;
  public status: number;
  public jobParametersString: string;
  public exitCode: string;
  public exitMessage: string;

  public stepExecutions: Array<StepExecution>;

  public restartable: boolean;
  public abandonable: boolean;
  public stoppable: boolean;
  public defined: boolean;

  constructor() {
    this.stepExecutions = new Array();
  }

  public get startTimeFormatted(): string {
    return DateTimeUtils.formatAsDateTime(this.startTime);
  }
}
