import { StepExecution } from './step-execution.model';

/**
 * Used to store the Step Execution data for a particular instance.
 *
 * @author Janne Valkealahti
 */
export class StepExecutionResource {

  public jobExecutionId: string;
  public stepExecution: StepExecution;
  public stepType: string;

  static fromJSON(input) {
    const stepExecutionResource = new StepExecutionResource();
    stepExecutionResource.jobExecutionId = input.jobExecutionId;
    stepExecutionResource.jobExecutionId = input.jobExecutionId;
    stepExecutionResource.stepExecution = StepExecution.fromJSON(input.stepExecution);
    stepExecutionResource.stepType = input.stepType;
    return stepExecutionResource;
  }

}
