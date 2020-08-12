import { FormControl } from '@angular/forms';
import { TaskPropValidator } from './task-prop.validator';

describe('tasks-jobs/tasks/task-prop.validator.ts', () => {

  describe('key', () => {
    it('invalid', () => {
      [
        'foo',
        'foo.bar',
        'apps.aaa'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(TaskPropValidator.key(control).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'app.foo',
        'deployer.foo',
        'scheduler.foo',
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(TaskPropValidator.key(control)).toBeNull();
      });
    });
  });

});
