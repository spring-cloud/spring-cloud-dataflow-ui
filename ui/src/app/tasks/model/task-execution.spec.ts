import { TASK_EXECUTIONS } from '../../tests/mocks/mock-data';
import { TaskExecution } from './task-execution';

describe('TaskExecution', () => {

  describe('FromJSON', () => {

    it('should parse the JSON into a TaskExecution model', () => {
      const jsonInput = TASK_EXECUTIONS._embedded.taskExecutionResourceList[0];
      const taskExecution = TaskExecution.fromJSON(jsonInput);
      expect(taskExecution.executionId).toBe(2);
      expect(taskExecution.exitCode).toBe(0);
      expect(taskExecution.taskName).toBe('foo1');
      expect(taskExecution.startTime).toBeNull();
      expect(taskExecution.endTime).toBeNull();
      expect(taskExecution.exitMessage).toBeNull();
      expect(taskExecution.errorMessage).toBeNull();
      expect(taskExecution.externalExecutionId).toBeNull();
    });

  });

});
