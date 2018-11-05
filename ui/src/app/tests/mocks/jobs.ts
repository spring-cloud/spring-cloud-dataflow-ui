import { Observable, of } from 'rxjs';
import { Page } from '../../shared/model/page';
import { JobExecution } from '../../jobs/model/job-execution.model';
import { StepExecutionResource } from '../../jobs/model/step-execution-resource.model';
import { StepExecutionProgress } from '../../jobs/model/step-execution-progress.model';

export class MockJobsService {

  jobsContext = {
    sort: 'name',
    order: 'ASC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  public jobExecutionsPage: Page<JobExecution>;

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

  setJobExecutions(mock) {
    let page = new Page<JobExecution>();
    if (mock._embedded && mock._embedded.jobExecutionResourceList) {
      page = JobExecution.pageFromJSON(mock);
    }
    this.jobExecutionsPage = page;
  }

  getStepExecutionProgress(jobid: string, stepid: string): Observable<StepExecutionProgress> {
    let stepExecutionProgress: StepExecutionProgress = null;
    if (this.testStepExecutionProgress) {
      stepExecutionProgress = StepExecutionProgress.fromJSON(this.testStepExecutionProgress);
    }
    return of(stepExecutionProgress);
  }

  getJobExecutions() {
    return of(this.jobExecutionsPage);
  }

  getJobExecution(id: string) {
    let jobExecution = null;
    if (this.testJobExecutions) {
      const jsonItem = this.testJobExecutions
        .find(je => je['executionId'] === +id);
      if (!jsonItem) {
        return of(jobExecution);
      }
      jobExecution = JobExecution.fromJSON(jsonItem);
    }
    return of(jobExecution);
  }

  getStepExecution(jobid: string, stepid: string): Observable<StepExecutionResource> {
    let stepExecutionResource: StepExecutionResource = null;
    if (this.testStepExecutionResource) {
      stepExecutionResource = StepExecutionResource.fromJSON(this.testStepExecutionResource);
    }

    return of(stepExecutionResource);
  }

  stopJob(item: JobExecution) {
    return of({});

  }

  restartJob(item: JobExecution) {
    return of({});
  }
}
