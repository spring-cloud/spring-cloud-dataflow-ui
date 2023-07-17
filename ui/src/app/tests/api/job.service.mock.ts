import {JobService} from '../../shared/api/job.service';
import {Observable, of} from 'rxjs';
import {
  ExecutionStepProgress,
  ExecutionStepResource,
  JobExecution,
  JobExecutionPage
} from '../../shared/model/job.model';
import {GET_EXECUTION, GET_JOBS_EXECUTIONS, GET_PROGRESS, GET_STEP} from '../data/job';
import {catchError, delay, map} from 'rxjs/operators';
import {ErrorUtils} from '../../shared/support/error.utils';
import {TaskExecution} from 'src/app/shared/model/task-execution.model';

export class JobServiceMock {
  static mock: JobServiceMock = null;

  getExecutions(page: number, size: number): Observable<JobExecutionPage | unknown> {
    return of(GET_JOBS_EXECUTIONS).pipe(delay(1), map(JobExecutionPage.parse), catchError(ErrorUtils.catchError));
  }

  getExecution(executionId: TaskExecution): Observable<JobExecution | unknown> {
    return of(GET_EXECUTION).pipe(delay(1), map(JobExecution.parse), catchError(ErrorUtils.catchError));
  }

  restart(execution: JobExecution): Observable<any> {
    return of(null);
  }

  stop(item: JobExecution): Observable<any> {
    return of(null);
  }

  getExecutionStep(jobExecutionId: string, stepId: string): Observable<ExecutionStepResource | unknown> {
    return of(GET_STEP).pipe(map(ExecutionStepResource.parse), catchError(ErrorUtils.catchError));
  }

  getExecutionStepProgress(jobExecutionId: string, stepId: string): Observable<ExecutionStepProgress | unknown> {
    return of(GET_PROGRESS).pipe(map(ExecutionStepProgress.parse), catchError(ErrorUtils.catchError));
  }

  static get provider(): any {
    if (!JobServiceMock.mock) {
      JobServiceMock.mock = new JobServiceMock();
    }
    return {provide: JobService, useValue: JobServiceMock.mock};
  }
}
