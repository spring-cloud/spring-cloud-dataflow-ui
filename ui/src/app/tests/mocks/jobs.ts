import { Observable } from 'rxjs/Observable';
import { Page } from '../../shared/model/page';
import { JobExecution } from '../../jobs/model/job-execution.model';
import { StepExecution } from '../../jobs/model/step-execution.model';
import { StepExecutionResource } from '../../jobs/model/step-execution-resource.model';
import { ExecutionContext } from '../../jobs/model/execution-context.model';
import * as moment from 'moment';

export class MockJobsService {

  private _testJobExecutions: JobExecution[];
  private _testStepExecutionResource: StepExecutionResource;

  get testJobExecutions() {
    return this._testJobExecutions;
  }

  set testJobExecutions(params: any) {
    this._testJobExecutions = params;
  }

  get testStepExecutionResource() {
    return this._testStepExecutionResource;
  }

  set testStepExecutionResource(params: any) {
    this._testStepExecutionResource = params;
  }

  getJobExecutions() {
    return Observable.of(new Page<JobExecution>());
  }

  getJobExecution(id: string) {
    const jobExecution = new JobExecution();
    if (this.testJobExecutions) {
      const jsonItem = this.testJobExecutions
        .find(je => je['executionId'] === +id);
      jobExecution.name = jsonItem.name;
      jobExecution.startTime = moment(jsonItem.jobExecution.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
      jobExecution.endTime = moment(jsonItem.jobExecution.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
      jobExecution.stepExecutionCount = jsonItem.stepExecutionCount;
      jobExecution.status = jsonItem.jobExecution.status;
      jobExecution.exitCode = jsonItem.jobExecution.exitStatus.exitCode;
      jobExecution.exitMessage = jsonItem.jobExecution.exitStatus.exitDescription;
      jobExecution.jobExecutionId = jsonItem.jobExecution.id;
      jobExecution.taskExecutionId = jsonItem.taskExecutionId;
      jobExecution.jobInstanceId = jsonItem.jobExecution.jobInstance.id;
      jobExecution.jobParametersString = jsonItem.jobParametersString;

      jsonItem.jobExecution.stepExecutions.forEach( stepExecutionItem => {
          const stepExecution = new StepExecution();
          stepExecution.id = stepExecutionItem.id;
          stepExecution.name = stepExecutionItem.stepName;
          stepExecution.readCount = stepExecutionItem.readCount;
          stepExecution.writeCount = stepExecutionItem.writeCount;
          stepExecution.commitCount = stepExecutionItem.commitCount;
          stepExecution.rollbackCount = stepExecutionItem.rollbackCount;
          stepExecution.readSkipCount = stepExecutionItem.readSkipCount;
          stepExecution.processSkipCount = stepExecutionItem.processSkipCount;
          stepExecution.writeSkipCount = stepExecutionItem.writeSkipCount;
          stepExecution.filterCount = stepExecutionItem.filterCount;
          stepExecution.startTime = moment.utc(stepExecutionItem.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
          stepExecution.endTime = moment.utc(stepExecutionItem.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
          stepExecution.status = stepExecutionItem.status;
          jobExecution.stepExecutions.push(stepExecution);
        }
      );

      jobExecution.restartable = jsonItem.restartable;
      jobExecution.abandonable = jsonItem.abandonable;
      jobExecution.stoppable = jsonItem.stoppable;
      jobExecution.defined = jsonItem.defined;
    }
    return Observable.of(jobExecution);
  }

  getStepExecution(jobid: string, stepid: string): Observable<StepExecutionResource> {
    const stepExecutionResource: StepExecutionResource = new StepExecutionResource();
    if (this.testStepExecutionResource) {
      const stepExecution: StepExecution = new StepExecution();
      const stepExecutionItem = this.testStepExecutionResource.stepExecution;
      stepExecution.id = stepExecutionItem.id;
      stepExecution.name = stepExecutionItem.stepName;
      stepExecution.status = stepExecutionItem.status;
      stepExecution.readCount = stepExecutionItem.readCount;
      stepExecution.writeCount = stepExecutionItem.writeCount;
      stepExecution.commitCount = stepExecutionItem.commitCount;
      stepExecution.rollbackCount = stepExecutionItem.rollbackCount;
      stepExecution.readSkipCount = stepExecutionItem.readSkipCount;
      stepExecution.processSkipCount = stepExecutionItem.processSkipCount;
      stepExecution.writeSkipCount = stepExecutionItem.writeSkipCount;
      stepExecution.filterCount = stepExecutionItem.filterCount;
      stepExecution.skipCount = stepExecutionItem.skipCount;
      stepExecution.startTime = moment.utc(stepExecutionItem.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
      stepExecution.endTime = moment.utc(stepExecutionItem.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]');
      const values = new Array<Map<string, string>>();
      stepExecutionItem.executionContext.values.forEach(item => {
        const map = new Map<string, string>();
        for (const prop in item) {
          if (item.hasOwnProperty(prop)) {
            map.set(prop, item[prop]);
          }
        }
        values.push(map);
      });
      stepExecution.executionContext = new ExecutionContext(
        stepExecutionItem.executionContext.dirty,
        stepExecutionItem.executionContext.empty,
        values);
      stepExecution.exitCode = stepExecutionItem.exitStatus.exitCode;
      stepExecution.exitMessage = stepExecutionItem.exitStatus.exitDescription;
      stepExecutionResource.jobExecutionId = this.testStepExecutionResource.jobExecutionId;
      stepExecutionResource.stepExecution = stepExecution;
      stepExecutionResource.stepType = this.testStepExecutionResource.stepType;
    }

    return Observable.of(stepExecutionResource);
  }
}
