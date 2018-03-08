import {FormControl} from '@angular/forms';


/**
 * Validators for Stream Deploy
 * Static methods
 *
 * @author Janne Valkealahti
 * @author Damien Vitrac
 */
export class StreamDeployValidator {

  /**
   * Key regex
   */
  static keyRegex = /^([a-zA-Z0-9]{2,50})([.][a-zA-Z0-9-\-\_]{2,50}?)*$/;

  /**
   * PropertyKey regex
   */
  static propertyKeyRegex = /^(deployer|app|version)(\.\*)?([.][a-zA-Z0-9]{2,50}?)*$/;
  /**
   * PropertyKey regex
   */
  static propertyPlatformRegex = /^(spring.cloud.dataflow.skipper.platformName)$/;

  /**
   * Number validator
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static number(formControl: FormControl): any {
    if (formControl.value === null || formControl.value === '') {
      return null;
    }
    if (!/^[0-9]*$/.test(formControl.value)) {
      return {invalid: true};
    }
    const num = +formControl.value;
    if (num < 1) {
      return {invalid: true};
    }
    return null;
  }

  /**
   * Key validator
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static key(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!StreamDeployValidator.keyRegex.test(formControl.value)) {
      return {invalid: true};
    }
    return null;
  }

  /**
   * Key validator
   *
   * @param {FormControl} formControl
   * @returns {any}
   */
  static keyProperty(formControl: FormControl): any {
    if (!formControl.value) {
      return null;
    }
    if (!StreamDeployValidator.propertyPlatformRegex.test(formControl.value)) {
      if (!StreamDeployValidator.propertyKeyRegex.test(formControl.value)) {
        return {invalid: true};
      }
    }
    return null;
  }

  /**
   * Validate the properties conditions
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
          if (!StreamDeployValidator.propertyPlatformRegex.test(tmp[0])) {
            if (!StreamDeployValidator.propertyKeyRegex.test(tmp[0])) {
              throw new Error();
            }
          }
        });
    } catch (e) {
      return {invalid: true};
    }
    return null;
  }

  /**
   * Verifies that the properties text box is properly formatted.
   * @param formControl used to obtain the value of the properties text box.
   * @returns {any} null if successful or reason of the failure.
   */
  static validateDeploymentProperties(formControl: FormControl) {
    const properties = formControl.value.split('\n');

    if (properties) {
      for (const prop of properties) {
        if (prop && prop.length > 0 && !prop.startsWith('#')) {
          const keyValue = prop.split('=');
          if (keyValue.length < 2) {
            return {
              validateDeploymentProperties: {
                reason: `Invalid deployment property "${prop}" must contain a single "=".`
              }
            };
          }
        }
      }
    }
    return undefined;
  }

}
