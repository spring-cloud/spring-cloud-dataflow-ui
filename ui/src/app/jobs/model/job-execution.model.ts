import { Moment } from 'moment';
import { DateTimeUtils } from '../../shared/support/date-time.utils';

export class JobExecution {
  public name: string;
  public taskExecutionId: number;
  public jobInstanceId: number;
  public jobExecutionId: number;
  public startTime: Moment;
  public endTime: Moment;
  public stepExecutionCount: number;
  public status: number;

  public restartable: boolean;
  public abandonable: boolean;
  public stoppable: boolean;
  public defined: boolean;

  public get startTimeFormatted(): string {
    return DateTimeUtils.formatAsDateTime(this.startTime);
  }
}
