import { StepExecution } from './step-execution.model';

export class StepExecutionProgress {

  public stepExecution: StepExecution;
  public stepExecutionHistory: StepExecutionHistory;
  public percentageComplete: number;
  public finished: boolean;
  public duration: number;
}

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

export class CountDetails {

  public count: number;
  public min: number;
  public max: number;
  public mean: number;
  public standardDeviation: number;
}
