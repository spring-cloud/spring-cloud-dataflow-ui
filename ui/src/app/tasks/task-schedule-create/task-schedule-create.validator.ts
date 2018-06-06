import { FormArray, FormControl } from '@angular/forms';

/**
 * Validators for Task Schedule
 * Static methods
 *
 * @author Damien Vitrac
 */
export class TaskScheduleCreateValidator {

  /**
   * Validate the cron expression
   * @param {FormControl} formControl
   * @returns {any}
   */
  static cron(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    /*if (!TaskScheduleCreateValidator.cronRegex.test(formControl.value)) {
      return { formatError: true };
    }*/
    return null;
  }

  /**
   * Validate the unique Name
   * @param {FormArray} formArray
   * @returns {any}
   */
  static uniqueName(formArray: FormArray): any {
    const arr = formArray.value as Array<string>;
    return arr.map((item) => {
      return arr.filter(a => !!item && a.toLowerCase() === item.toLowerCase()).length;
    }).filter((item) => item > 1).length > 0 ? { notUnique: true } : null;
  }

  /**
   * Validate the unique Name
   * @param {FormControl} control
   * @param {Array<string>} names
   * @returns {any}
   */
  static existName(control: FormControl, names: Array<string>): any {
    return !!control.value && (names.indexOf(control.value.toLowerCase()) > -1) ? { exist: true } : null;
  }

}
