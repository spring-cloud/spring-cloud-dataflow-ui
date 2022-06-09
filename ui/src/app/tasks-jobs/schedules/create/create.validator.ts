import {UntypedFormArray, UntypedFormControl} from '@angular/forms';

export class SchedulesCreateValidator {
  static cron(formControl: UntypedFormControl): any {
    if (!formControl.value) {
      return null;
    }
    return null;
  }

  static uniqueName(formArray: UntypedFormArray): any {
    const arr = formArray.value as Array<string>;
    return arr
      .map(item => arr.filter(a => !!item && a.toLowerCase() === item.toLowerCase()).length)
      .filter(item => item > 1).length > 0
      ? {notUnique: true}
      : null;
  }

  static existName(control: UntypedFormControl, names: Array<string>): any {
    return !!control.value && names.indexOf(control.value.toLowerCase()) > -1 ? {exist: true} : null;
  }
}
