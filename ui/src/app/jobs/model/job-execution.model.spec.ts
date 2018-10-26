import { JobExecution } from './job-execution.model';
import { JOB_EXECUTIONS_WITH_PAGINATION, JOBS_EXECUTIONS_1 } from '../../tests/mocks/mock-data';
import { DateTime } from 'luxon';

describe('JobExecution', () => {

  describe('FromJSON', () => {
    it('should parse the JSON into a JobExecution model', () => {
      const jsonInput = JOB_EXECUTIONS_WITH_PAGINATION._embedded.jobExecutionResourceList[2];
      const jobExecution = JobExecution.fromJSON(jsonInput);
      expect(jobExecution.name).toBe('job2');
      expect(jobExecution.startTime.toISO()).toBe(DateTime.fromISO('2017-09-06T00:54:46.000Z').toISO());
      expect(jobExecution.stepExecutionCount).toBe(1);
      expect(jobExecution.status).toBe('COMPLETED');
      expect(jobExecution.jobExecutionId).toBe(2);
      expect(jobExecution.taskExecutionId).toBe(95);
      expect(jobExecution.jobInstanceId).toBe(2);
      expect(jobExecution.restartable).toBe(false);
      expect(jobExecution.abandonable).toBe(false);
      expect(jobExecution.stoppable).toBe(false);
      expect(jobExecution.defined).toBe(false);
    });

    it('should parse the JSON into a JobExecution model with step execution', () => {
      const jobExecution = JobExecution.fromJSON(JOBS_EXECUTIONS_1);
      expect(jobExecution.name).toBe('job1');
      expect(jobExecution.startTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.027Z').toISO());
      expect(jobExecution.endTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.067Z').toISO());
      expect(jobExecution.stepExecutionCount).toBe(1);
      expect(jobExecution.status).toBe('COMPLETED');
      expect(jobExecution.exitCode).toBe('COMPLETED');
      expect(jobExecution.exitMessage).toBe('');
      expect(jobExecution.jobExecutionId).toBe(1);
      expect(jobExecution.taskExecutionId).toBe(2);
      expect(jobExecution.jobInstanceId).toBe(1);
      expect(jobExecution.jobParametersString).toBe('--spring.cloud.task.executionid=2');
      expect(jobExecution.restartable).toBe(false);
      expect(jobExecution.abandonable).toBe(false);
      expect(jobExecution.stoppable).toBe(false);
      expect(jobExecution.defined).toBe(true);
      expect(jobExecution.stepExecutions[0].id.toString()).toBe('1');
      expect(jobExecution.stepExecutions[0].name).toBe('job1step1');
      expect(jobExecution.stepExecutions[0].readCount).toBe(0);
      expect(jobExecution.stepExecutions[0].writeCount).toBe(0);
      expect(jobExecution.stepExecutions[0].commitCount).toBe(1);
      expect(jobExecution.stepExecutions[0].rollbackCount).toBe(0);
      expect(jobExecution.stepExecutions[0].readSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].processSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].writeSkipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].filterCount).toBe(0);
      expect(jobExecution.stepExecutions[0].skipCount).toBe(0);
      expect(jobExecution.stepExecutions[0].startTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.046Z').toISO());
      expect(jobExecution.stepExecutions[0].endTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.064Z').toISO());
      expect(jobExecution.stepExecutions[0].status).toBe('COMPLETED');
    });

  });

});
