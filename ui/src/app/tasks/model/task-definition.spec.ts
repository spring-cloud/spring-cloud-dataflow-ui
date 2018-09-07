import { TASK_DEFINITIONS } from '../../tests/mocks/mock-data';
import { TaskDefinition } from './task-definition';

describe('TaskDefinition', () => {

  describe('FromJSON', () => {

    it('should parse the JSON into a TaskDefinition model', () => {
      const jsonInput = TASK_DEFINITIONS._embedded.taskDefinitionResourceList[0];
      const taskDefinition = TaskDefinition.fromJSON(jsonInput);
      expect(taskDefinition.name).toBe('foo');
      expect(taskDefinition.dslText).toBe('bar');
      expect(taskDefinition.composed).toBe(true);
      expect(taskDefinition.status).toBe('unknown');
    });

  });

});
