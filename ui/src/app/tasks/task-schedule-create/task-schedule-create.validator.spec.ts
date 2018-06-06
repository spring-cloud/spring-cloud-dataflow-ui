import { FormArray, FormControl } from '@angular/forms';
import { TaskScheduleCreateValidator } from './task-schedule-create.validator';

/**
 * Test Task Schedule Create Validator functions {TaskScheduleCreateValidator}.
 *
 * @author Damien Vitrac
 */
describe('TaskScheduleCreateValidator', () => {

  describe('cron', () => {

    it('invalid', () => {
      [].forEach((mock) => {
        const form: FormControl = new FormControl(mock);
        expect(TaskScheduleCreateValidator.cron(form)).toBeTruthy();
      });
    });

    it('valid', () => {
      [
        null,
        '0 0 0 0 0 0 0',
        '0 15 10 * * ? 2005',
        '0 15 10 ? * 6L 2002-2005',
        '0 15 10 ? * MON-FRI',
        '0 15 10 ? * 6#3',
        '0 11 11 11 11 ?',
        '0 0 12 * * ?',
        '0 15 10 * * ? *',
        '0 0/5 14,18 * * ?'
      ].forEach((mock) => {
        const form: FormControl = new FormControl(mock);
        expect(TaskScheduleCreateValidator.cron(form)).toBeNull();
      });
    });

  });

  describe('uniqueName', () => {
    it('invalid', () => {
      [
        ['aa', 'aa'],
        ['AA', 'aa']
      ].forEach((mock) => {
        const form: FormArray = new FormArray([new FormControl(mock[0]), new FormControl(mock[1])]);
        expect(TaskScheduleCreateValidator.uniqueName(form)).toBeTruthy();
      });
    });

    it('valid', () => {
      [
        ['', ''],
        ['aa', 'bb']
      ].forEach((mock) => {
        const form: FormArray = new FormArray([new FormControl(mock[0]), new FormControl(mock[1])]);
        expect(TaskScheduleCreateValidator.uniqueName(form)).toBeNull();
      });
    });
  });

  describe('existName', () => {
    const names = ['foo', 'bar'];
    it('invalid', () => {
      [
        'foo',
        'bar',
        'FOO',
        'BAR'
      ].forEach((mock) => {
        const form: FormControl = new FormControl(mock);
        expect(TaskScheduleCreateValidator.existName(form, names)).toBeTruthy();
      });
    });

    it('valid', () => {
      [
        'foo1',
        'bar1',
        ''
      ].forEach((mock) => {
        const form: FormControl = new FormControl(mock);
        expect(TaskScheduleCreateValidator.existName(form, names)).toBeNull();
      });
    });
  });

});
