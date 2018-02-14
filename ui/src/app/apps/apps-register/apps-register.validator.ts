import {FormControl, FormGroup} from '@angular/forms';

/**
 * Validators for Register Form
 * Static methods
 *
 * @author Damien Vitrac
 */
export class AppsRegisterValidator {

  /**
   * Name regex
   */
  static nameRegex = /^[a-zA-Z0-9]{2,50}$/;

  /**
   * Uri regex
   */
  static uriRegex = /^([a-zA-Z0-9-]+:\/\/)([\\w\\.:-]+)?([a-zA-Z0-9-\/.:-]+)*$/;

  /**
   * Validate the name conditions: no space, 2 characters min, no specials characters
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static appName(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }

    if (!AppsRegisterValidator.nameRegex.test(formControl.value)) {
      return {invalid: true};
    }

    return null;
  }

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

    if (!AppsRegisterValidator.uriRegex.test(formControl.value)) {
      return {invalid: true};
    }

    return null;
  }

}
