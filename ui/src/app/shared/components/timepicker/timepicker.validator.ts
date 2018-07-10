import { FormControl } from '@angular/forms';

/**
 * Validators for Timepicker Component
 * Static methods
 *
 * @author Damien Vitrac
 */
export class TimepickerValidator {

  /**
   * Uri time
   */
  static uriTimeRegex = /^(?:(?:([01]?\d|2[0-3]):)([0-5]?\d):)([0-5]?\d)$/;


  /**
   * Validate the name conditions: no space, 2 characters min, no specials characters
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static time(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!TimepickerValidator.uriTimeRegex.test(formControl.value)) {
      return { invalid: true };
    }
    return null;
  }

}
