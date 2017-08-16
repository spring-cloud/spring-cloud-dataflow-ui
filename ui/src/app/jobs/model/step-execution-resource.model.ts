import {StepExecution} from './step-execution.model';

export class StepExecutionResource {

  public jobExecutionId: string;
  public stepExecution: StepExecution;
  public stepType: string;
}
