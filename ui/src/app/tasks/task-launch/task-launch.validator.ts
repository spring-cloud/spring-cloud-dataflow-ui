import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Validators for Task Launch Form
 * Static methods
 *
 * @author Damien Vitrac
 */
export class TaskLaunchValidator {

  /**
   * Key is required if the group is not empty
   *
   * @param {FormGroup} group
   * @returns {any}
   */
  static keyRequired(group: FormGroup) {
    const control = new FormControl(null, Validators.required);
    const hasValueSet = group.get('val').value !== '';
    control.setValue(group.get('key').value);
    if (!hasValueSet || (hasValueSet && control.valid)) {
      return null;
    }
    return { invalid: true };
  }

}
