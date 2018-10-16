import { FormControl, FormGroup } from '@angular/forms';
import { TaskLaunchValidator } from './task-launch.validator';

/**
 * Test Task Launch Validator functions {TaskLaunchValidator}.
 *
 * @author Damien Vitrac
 */
describe('TaskLaunchValidator', () => {

  describe('keyRequired', () => {
    it('invalid', () => {
      [
        ['', 'bbb'],
        [undefined, undefined]
      ].forEach((mock) => {
        const group: FormGroup = new FormGroup({
          'key': new FormControl(mock[0]),
          'val': new FormControl(mock[1])
        });
        expect(TaskLaunchValidator.keyRequired(group).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        ['foo', 'bar'],
        ['foo', '']
      ].forEach((mock) => {
        const group: FormGroup = new FormGroup({
          'key': new FormControl(mock[0]),
          'val': new FormControl(mock[1])
        });
        expect(TaskLaunchValidator.keyRequired(group)).toBeNull();
      });
    });
  });

  describe('key', () => {
    it('invalid', () => {
      [
        'foo',
        'foo.bar',
        'apps.aaa'
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(TaskLaunchValidator.key(control).invalid).toBeTruthy();
      });
    });
    it('valid', () => {
      [
        'app.foo',
        'deployer.foo',
        'scheduler.foo',
      ].forEach((mock) => {
        const control: FormControl = new FormControl(mock);
        expect(TaskLaunchValidator.key(control)).toBeNull();
      });
    });
  });

});
