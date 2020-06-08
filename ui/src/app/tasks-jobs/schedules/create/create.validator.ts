import { FormArray, FormControl } from '@angular/forms';

export class SchedulesCreateValidator {

  static cron(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    return null;
  }

  static uniqueName(formArray: FormArray): any {
    const arr = formArray.value as Array<string>;
    return arr.map((item) => {
      return arr.filter(a => !!item && a.toLowerCase() === item.toLowerCase()).length;
    }).filter((item) => item > 1).length > 0 ? { notUnique: true } : null;
  }

  static existName(control: FormControl, names: Array<string>): any {
    return !!control.value && (names.indexOf(control.value.toLowerCase()) > -1) ? { exist: true } : null;
  }

}
