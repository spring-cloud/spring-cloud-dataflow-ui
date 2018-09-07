import { StepExecution } from './step-execution.model';


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

  static fromJSON(input): StepExecutionHistory {
    const stepExecutionHistory: StepExecutionHistory = new StepExecutionHistory();
    stepExecutionHistory.stepName = input.stepName;
    stepExecutionHistory.count = input.count;

    ['commitCount', 'rollbackCount', 'readCount', 'writeCount', 'filterCount', 'readSkipCount', 'writeSkipCount',
      'processSkipCount', 'duration', 'durationPerRead'].forEach((item) => {
      stepExecutionHistory[item] = new CountDetails();
      stepExecutionHistory[item].count = input[item].count;
      stepExecutionHistory[item].min = input[item].min;
      stepExecutionHistory[item].max = input[item].max;
      stepExecutionHistory[item].mean = input[item].mean;
      stepExecutionHistory[item].standardDeviation = input[item].standardDeviation;
    });

    return stepExecutionHistory;
  }

}

/**
 * Stores the step execution and its history along with the current percentage complete for the step execution.
 */
export class StepExecutionProgress {

  public stepExecution: StepExecution;
  public stepExecutionHistory: StepExecutionHistory;
  public percentageComplete: number;
  public finished: boolean;
  public duration: number;

  static fromJSON(input): StepExecutionProgress {
    const stepExecutionProgress: StepExecutionProgress = new StepExecutionProgress();
    stepExecutionProgress.percentageComplete = input.percentageComplete;
    stepExecutionProgress.finished = input.finished;
    stepExecutionProgress.duration = input.duration;
    stepExecutionProgress.stepExecution = StepExecution.fromJSON(input.stepExecution);
    if (input.stepExecutionHistory) {
      stepExecutionProgress.stepExecutionHistory = StepExecutionHistory.fromJSON(input.stepExecutionHistory);
    }
    return stepExecutionProgress;
  }

}
