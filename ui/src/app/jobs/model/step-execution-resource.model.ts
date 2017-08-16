import {StepExecution} from './step-execution.model';

/**
 * Used to store the Step Execution data for a particular instance.
 *
 * @author Janne Valkealahti
 */
export class StepExecutionResource {

  public jobExecutionId: string;
  public stepExecution: StepExecution;
  public stepType: string;
}
