import { Observable } from 'rxjs/Observable';
import { Page } from '../../shared/model/page';
import { JobExecution } from '../../jobs/model/job-execution.model';
import { StepExecution } from '../../jobs/model/step-execution.model';
import { StepExecutionResource } from '../../jobs/model/step-execution-resource.model';
import { ExecutionContext } from '../../jobs/model/execution-context.model';
import * as moment from 'moment';
import {
  CountDetails, StepExecutionHistory,
  StepExecutionProgress
} from '../../jobs/model/step-execution-progress.model';

export class MockJobsService {

  private _testJobExecutions: JobExecution[];
  private _testStepExecutionResource: StepExecutionResource;
  private _testStepExecutionProgress: StepExecutionProgress;

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

  get testStepExecutionProgress() {
    return this._testStepExecutionProgress;
  }

  set testStepExecutionProgress(params: any) {
    this._testStepExecutionProgress = params;
  }

  getStepExecutionProgress(jobid: string, stepid: string): Observable<StepExecutionProgress> {
    let stepExecutionProgress: StepExecutionProgress = null;
    console.log('XXX1', this.testStepExecutionProgress);
    if (this.testStepExecutionProgress) {
      stepExecutionProgress = new StepExecutionProgress();
      const body = this.testStepExecutionProgress;
      stepExecutionProgress.percentageComplete = body.percentageComplete;
      stepExecutionProgress.finished = body.finished;
      stepExecutionProgress.duration = body.duration;
      const stepExecutionItem = body.stepExecution;
      const stepExecution: StepExecution = new StepExecution();
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
      stepExecutionProgress.stepExecution = stepExecution;
      const stepExecutionHistory: StepExecutionHistory = new StepExecutionHistory();
      stepExecutionHistory.stepName = body.stepExecutionHistory.stepName;
      stepExecutionHistory.count = body.stepExecutionHistory.count;

      stepExecutionHistory.commitCount = new CountDetails();
      stepExecutionHistory.commitCount.count = body.stepExecutionHistory.commitCount.count;
      stepExecutionHistory.commitCount.min = body.stepExecutionHistory.commitCount.min;
      stepExecutionHistory.commitCount.max = body.stepExecutionHistory.commitCount.max;
      stepExecutionHistory.commitCount.mean = body.stepExecutionHistory.commitCount.mean;
      stepExecutionHistory.commitCount.standardDeviation = body.stepExecutionHistory.commitCount.standardDeviation;

      stepExecutionHistory.rollbackCount = new CountDetails();
      stepExecutionHistory.rollbackCount.count = body.stepExecutionHistory.rollbackCount.count;
      stepExecutionHistory.rollbackCount.min = body.stepExecutionHistory.rollbackCount.min;
      stepExecutionHistory.rollbackCount.max = body.stepExecutionHistory.rollbackCount.max;
      stepExecutionHistory.rollbackCount.mean = body.stepExecutionHistory.rollbackCount.mean;
      stepExecutionHistory.rollbackCount.standardDeviation = body.stepExecutionHistory.rollbackCount.standardDeviation;

      stepExecutionHistory.readCount = new CountDetails();
      stepExecutionHistory.readCount.count = body.stepExecutionHistory.readCount.count;
      stepExecutionHistory.readCount.min = body.stepExecutionHistory.readCount.min;
      stepExecutionHistory.readCount.max = body.stepExecutionHistory.readCount.max;
      stepExecutionHistory.readCount.mean = body.stepExecutionHistory.readCount.mean;
      stepExecutionHistory.readCount.standardDeviation = body.stepExecutionHistory.readCount.standardDeviation;

      stepExecutionHistory.writeCount = new CountDetails();
      stepExecutionHistory.writeCount.count = body.stepExecutionHistory.writeCount.count;
      stepExecutionHistory.writeCount.min = body.stepExecutionHistory.writeCount.min;
      stepExecutionHistory.writeCount.max = body.stepExecutionHistory.writeCount.max;
      stepExecutionHistory.writeCount.mean = body.stepExecutionHistory.writeCount.mean;
      stepExecutionHistory.writeCount.standardDeviation = body.stepExecutionHistory.writeCount.standardDeviation;

      stepExecutionHistory.filterCount = new CountDetails();
      stepExecutionHistory.filterCount.count = body.stepExecutionHistory.filterCount.count;
      stepExecutionHistory.filterCount.min = body.stepExecutionHistory.filterCount.min;
      stepExecutionHistory.filterCount.max = body.stepExecutionHistory.filterCount.max;
      stepExecutionHistory.filterCount.mean = body.stepExecutionHistory.filterCount.mean;
      stepExecutionHistory.filterCount.standardDeviation = body.stepExecutionHistory.filterCount.standardDeviation;

      stepExecutionHistory.readSkipCount = new CountDetails();
      stepExecutionHistory.readSkipCount.count = body.stepExecutionHistory.readSkipCount.count;
      stepExecutionHistory.readSkipCount.min = body.stepExecutionHistory.readSkipCount.min;
      stepExecutionHistory.readSkipCount.max = body.stepExecutionHistory.readSkipCount.max;
      stepExecutionHistory.readSkipCount.mean = body.stepExecutionHistory.readSkipCount.mean;
      stepExecutionHistory.readSkipCount.standardDeviation = body.stepExecutionHistory.readSkipCount.standardDeviation;

      stepExecutionHistory.writeSkipCount = new CountDetails();
      stepExecutionHistory.writeSkipCount.count = body.stepExecutionHistory.writeSkipCount.count;
      stepExecutionHistory.writeSkipCount.min = body.stepExecutionHistory.writeSkipCount.min;
      stepExecutionHistory.writeSkipCount.max = body.stepExecutionHistory.writeSkipCount.max;
      stepExecutionHistory.writeSkipCount.mean = body.stepExecutionHistory.writeSkipCount.mean;
      stepExecutionHistory.writeSkipCount.standardDeviation = body.stepExecutionHistory.writeSkipCount.standardDeviation;

      stepExecutionHistory.processSkipCount = new CountDetails();
      stepExecutionHistory.processSkipCount.count = body.stepExecutionHistory.processSkipCount.count;
      stepExecutionHistory.processSkipCount.min = body.stepExecutionHistory.processSkipCount.min;
      stepExecutionHistory.processSkipCount.max = body.stepExecutionHistory.processSkipCount.max;
      stepExecutionHistory.processSkipCount.mean = body.stepExecutionHistory.processSkipCount.mean;
      stepExecutionHistory.processSkipCount.standardDeviation = body.stepExecutionHistory.processSkipCount.standardDeviation;

      stepExecutionHistory.duration = new CountDetails();
      stepExecutionHistory.duration.count = body.stepExecutionHistory.duration.count;
      stepExecutionHistory.duration.min = body.stepExecutionHistory.duration.min;
      stepExecutionHistory.duration.max = body.stepExecutionHistory.duration.max;
      stepExecutionHistory.duration.mean = body.stepExecutionHistory.duration.mean;
      stepExecutionHistory.duration.standardDeviation = body.stepExecutionHistory.duration.standardDeviation;

      stepExecutionHistory.durationPerRead = new CountDetails();
      stepExecutionHistory.durationPerRead.count = body.stepExecutionHistory.durationPerRead.count;
      stepExecutionHistory.durationPerRead.min = body.stepExecutionHistory.durationPerRead.min;
      stepExecutionHistory.durationPerRead.max = body.stepExecutionHistory.durationPerRead.max;
      stepExecutionHistory.durationPerRead.mean = body.stepExecutionHistory.durationPerRead.mean;
      stepExecutionHistory.durationPerRead.standardDeviation = body.stepExecutionHistory.durationPerRead.standardDeviation;

      stepExecutionProgress.stepExecutionHistory = stepExecutionHistory;
    }
    return Observable.of(stepExecutionProgress);
  }

  getJobExecutions() {
    return Observable.of(new Page<JobExecution>());
  }

  getJobExecution(id: string) {
    let jobExecution = null;
    if (this.testJobExecutions) {
      const jsonItem = this.testJobExecutions
        .find(je => je['executionId'] === +id);
      if (!jsonItem) {
        return Observable.of(jobExecution);
      } else {
        jobExecution = new JobExecution();
      }
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
    let  stepExecutionResource: StepExecutionResource = null;
    if (this.testStepExecutionResource) {
      const stepExecution: StepExecution = new StepExecution();
      stepExecutionResource = new StepExecutionResource();
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
