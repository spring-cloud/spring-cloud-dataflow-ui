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

  /**
   * Key should start with app. or deployer. or scheduler if not empty
   *
   * @param {FormControl} control
   * @returns {any}
   */
  static key(control: FormControl) {
    const value = control.value;
    if (value && !value.startsWith('app.') && !value.startsWith('deployer.') && !value.startsWith('scheduler.')) {
      return { invalid: true };
    }
    return null;
  }

}
