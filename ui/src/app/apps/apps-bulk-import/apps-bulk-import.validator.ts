import {FormControl, FormGroup} from '@angular/forms';
import {AppsBulkImportComponent} from './apps-bulk-import.component';

/**
 * Validators for Bulk Import Form
 * Static methods
 *
 * @author Damien Vitrac
 */
export class AppsBulkImportValidator {

  /**
   * Uri regex
   */
  static uriRegex = /^([a-zA-Z0-9-]+:\/\/)([\\w\\.:-]+)?([a-zA-Z0-9-\/.:-]+)*$/;

  /**
   * Validate the conditions: uri or properties value
   *
   * @param {FormGroup} control
   * @returns {any} An object error
   */
  static form(control: FormGroup): any {
    const uri = control.get('uri');
    const properties = control.get('properties');

    if (!uri.value && !properties.value) {
      return {invalid: true};
    }
    if (uri.value && properties.value) {
      return {both: true};
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

    if (!AppsBulkImportValidator.uriRegex.test(formControl.value)) {
      return {invalid: true};
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
          if (!AppsBulkImportValidator.uriRegex.test(tmp[1])) {
            throw new Error();
          }
        });
    } catch (e) {
      return {invalid: true};
    }
    return null;

  }
}
