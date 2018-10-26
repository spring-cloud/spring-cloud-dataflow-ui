import { JOBS_EXECUTIONS_1_STEPS_1_PROGRESS } from '../../tests/mocks/mock-data';
import { StepExecutionProgress } from './step-execution-progress.model';
import { DateTime } from 'luxon';

describe('StepExecutionProgress', () => {

  describe('FromJSON', () => {

    it('should parse the JSON into a StepExecutionProgress model', () => {
      const stepExecutionProgress = StepExecutionProgress.fromJSON(JOBS_EXECUTIONS_1_STEPS_1_PROGRESS);
      expect(stepExecutionProgress.stepExecution.name).toBe('job1step1');
      expect(stepExecutionProgress.stepExecution.executionContext.dirty).toBe(true);
      expect(stepExecutionProgress.percentageComplete).toBe(1);
      expect(stepExecutionProgress.finished).toBe(true);
      expect(stepExecutionProgress.duration).toBe(13);
      expect(stepExecutionProgress.stepExecution.id.toString()).toBe('1');
      expect(stepExecutionProgress.stepExecution.status).toBe('COMPLETED');
      expect(stepExecutionProgress.stepExecution.readCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.writeCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.commitCount).toBe(1);
      expect(stepExecutionProgress.stepExecution.writeCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.rollbackCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.readSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.processSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.writeSkipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.skipCount).toBe(0);
      expect(stepExecutionProgress.stepExecution.startTime.toISO()).toBe(DateTime.fromISO('2017-08-21T07:25:05.028Z').toISO());
      expect(stepExecutionProgress.stepExecution.endTime.toISO()).toBe(DateTime.fromISO('2017-08-21T07:25:05.041Z').toISO());
      expect(stepExecutionProgress.stepExecution.exitCode).toBe('COMPLETED');
      expect(stepExecutionProgress.stepExecution.exitMessage).toBe('');
      expect(stepExecutionProgress.stepExecutionHistory.stepName).toBe('job1step1');
      expect(stepExecutionProgress.stepExecutionHistory.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.min).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.max).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.mean).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.commitCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.rollbackCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.filterCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.readSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.writeSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.processSkipCount.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.duration.count).toBe(1);
      expect(stepExecutionProgress.stepExecutionHistory.duration.min).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.max).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.mean).toBe(13);
      expect(stepExecutionProgress.stepExecutionHistory.duration.standardDeviation).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.count).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.min).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.max).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.mean).toBe(0);
      expect(stepExecutionProgress.stepExecutionHistory.durationPerRead.standardDeviation).toBe(0);
    });

  });

});
