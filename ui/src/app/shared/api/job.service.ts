import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtils } from '../support/http.utils';
import { catchError, map } from 'rxjs/operators';
import { ExecutionStepProgress, ExecutionStepResource, JobExecution, JobExecutionPage } from '../model/job.model';
import { ErrorUtils } from '../support/error.utils';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private httpClient: HttpClient) {
  }

  getExecutions(page: number, size: number, fromDate?: DateTime, toDate?: DateTime): Observable<JobExecutionPage> {
    let params = HttpUtils.getPaginationParams(page, size);
    if (fromDate) {
      params = params.append('fromDate', fromDate.toISODate() + 'T00:00:00,000');
    }
    if (toDate) {
      params = params.append('toDate', toDate.toISODate() + 'T23:59:59,999');
    }
    return this.httpClient
      .get<any>('/jobs/thinexecutions', { params })
      .pipe(
        map(JobExecutionPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getExecution(executionId: string): Observable<JobExecution> {
    return this.httpClient
      .get<any>(`/jobs/executions/${executionId}`, {})
      .pipe(
        map(JobExecution.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  restart(execution: JobExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(`/jobs/executions/${execution.jobExecutionId}?restart=true`, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  stop(item: JobExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(`/jobs/executions/${item.jobExecutionId}?stop=true`, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  getExecutionStep(jobExecutionId: string, stepId: string): Observable<ExecutionStepResource> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/jobs/executions/${jobExecutionId}/steps/${stepId}`, { headers })
      .pipe(
        map(ExecutionStepResource.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getExecutionStepProgress(jobExecutionId: string, stepId: string): Observable<ExecutionStepProgress> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/jobs/executions/${jobExecutionId}/steps/${stepId}/progress`, { headers })
      .pipe(
        map(ExecutionStepProgress.parse),
        catchError(ErrorUtils.catchError)
      );
  }

}
