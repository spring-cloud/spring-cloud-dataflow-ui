import { FormControl, FormGroup } from '@angular/forms';

/**
 * Validators for Bulk Import Form
 * Static methods
 *
 * @author Damien Vitrac
 */
export class AppsAddValidator {

  /**
   * Uri regex
   */
  static uriRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  /**
   * Validate the uri conditions
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static uri(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!AppsAddValidator.uriRegex.test(formControl.value)) {
      return { invalid: true };
    }
    return null;
  }

  /**
   * Validate the properties conditions: a=b per line
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static properties(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }

    let tmp;
    try {
      formControl.value.toString()
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => a.toString())
        .map((a: String) => {
          tmp = a.split('=');
          if (tmp.length !== 2) {
            throw new Error();
          }
          const val: string = tmp[1];
          const startWidth = ['http://', 'https://', 'docker:', 'maven://'];
          if (startWidth.filter((b) => val.startsWith(b)).length === 0) {
            throw new Error();
          }
        });
    } catch (e) {
      return { invalid: true };
    }
    return null;
  }

}
