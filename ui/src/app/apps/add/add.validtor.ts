import { FormControl } from '@angular/forms';

/**
 * Validators for Bulk Import Form
 * Static methods
 *
 * @author Damien Vitrac
 */
export class AppsAddValidator {

  static uriRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  static appNameRegex = /^.{2,250}$/;
  static appUriRegex = /^.{2,250}$/;

  static uri(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!AppsAddValidator.uriRegex.test(formControl.value)) {
      return { invalid: true };
    }
    return null;
  }

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
        .map((a: string) => {
          tmp = a.split('=');
          if (tmp.length !== 2) {
            throw new Error();
          }
          const val: string = tmp[1];
          const startWidth = ['http://', 'https://', 'docker:', 'maven://'];
          if (startWidth.filter((b) => val.trim().startsWith(b)).length === 0) {
            throw new Error();
          }
        });
    } catch (e) {
      return { invalid: true };
    }
    return null;
  }

  static appName(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!AppsAddValidator.appNameRegex.test(formControl.value)) {
      return { invalid: true };
    }
    return null;
  }

  static appUri(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!AppsAddValidator.appUriRegex.test(formControl.value)) {
      return { invalid: true };
    }
    return null;
  }

}
