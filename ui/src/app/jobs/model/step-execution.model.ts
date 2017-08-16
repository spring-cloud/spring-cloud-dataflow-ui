import { Moment } from 'moment';
import { ExecutionContext } from './execution-context.model';

/**
 * Contains information about a specific step execution.
 * @author Janne Valkealahti
 */
export class StepExecution {
  public id: string;
  public name: string;
  public status: string;
  public readCount: number;
  public writeCount: number;
  public commitCount: number;
  public rollbackCount: number;
  public readSkipCount: number;
  public processSkipCount: number;
  public writeSkipCount: number;
  public filterCount: number;
  public skipCount: number;
  public startTime: Moment;
  public endTime: Moment;
  public executionContext: ExecutionContext;
  public exitCode: string;
  public exitMessage: string;
}
