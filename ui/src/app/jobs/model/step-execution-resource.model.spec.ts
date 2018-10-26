import { JOBS_EXECUTIONS_1_STEPS_1 } from '../../tests/mocks/mock-data';
import { StepExecutionResource } from './step-execution-resource.model';
import { DateTime } from 'luxon';

describe('StepExecutionResource', () => {

  describe('FromJSON', () => {

    it('should parse the JSON into a StepExecutionResource model', () => {
      const response = JOBS_EXECUTIONS_1_STEPS_1;
      const stepExecutionResource = StepExecutionResource.fromJSON(response);
      expect(stepExecutionResource.jobExecutionId.toString()).toBe('1');
      expect(stepExecutionResource.stepType).toBe('org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1');
      expect(stepExecutionResource.stepExecution.id.toString()).toBe('1');
      expect(stepExecutionResource.stepExecution.name).toBe('job1step1');
      expect(stepExecutionResource.stepExecution.executionContext.dirty).toBe(true);
      expect(stepExecutionResource.stepExecution.status).toBe('COMPLETED');
      expect(stepExecutionResource.stepExecution.readCount).toBe(0);
      expect(stepExecutionResource.stepExecution.writeCount).toBe(0);
      expect(stepExecutionResource.stepExecution.commitCount).toBe(1);
      expect(stepExecutionResource.stepExecution.rollbackCount).toBe(0);
      expect(stepExecutionResource.stepExecution.readSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.processSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.writeSkipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.filterCount).toBe(0);
      expect(stepExecutionResource.stepExecution.skipCount).toBe(0);
      expect(stepExecutionResource.stepExecution.startTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.046Z').toISO());
      expect(stepExecutionResource.stepExecution.endTime.toISO()).toBe(DateTime.fromISO('2017-08-11T06:15:50.064Z').toISO());
    });

  });

});
