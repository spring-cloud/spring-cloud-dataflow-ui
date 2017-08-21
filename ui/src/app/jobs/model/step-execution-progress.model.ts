import { StepExecution } from './step-execution.model';

/**
 * Stores the step execution and its history along with the current percentage complete for the step execution.
 */
export class StepExecutionProgress {

  public stepExecution: StepExecution;
  public stepExecutionHistory: StepExecutionHistory;
  public percentageComplete: number;
  public finished: boolean;
  public duration: number;
}

/**
 * Stores the statistics of given StepExecution.
 */
export class StepExecutionHistory {

  public stepName: string;
  public count: number;
  public commitCount: CountDetails;
  public rollbackCount: CountDetails;
  public readCount: CountDetails;
  public writeCount: CountDetails;
  public filterCount: CountDetails;
  public readSkipCount: CountDetails;
  public writeSkipCount: CountDetails;
  public processSkipCount: CountDetails;
  public duration: CountDetails;
  public durationPerRead: CountDetails;
}

/**
 * Utility class that stores the measurements on how a specific attribute of a StepExeuction is behaving in a
 * StepExecution.
 */
export class CountDetails {

  public count: number;
  public min: number;
  public max: number;
  public mean: number;
  public standardDeviation: number;
}
