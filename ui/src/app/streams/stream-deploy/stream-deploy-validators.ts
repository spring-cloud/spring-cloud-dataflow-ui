import { FormControl } from '@angular/forms';

/**
 * Verifies that the properties text box is properly formatted.
 * @param formControl used to obtain the value of the properties text box.
 * @returns {any} null if successful or reason of the failure.
 */
export function validateDeploymentProperties(formControl: FormControl) {
  const properties = formControl.value.split('\n');
  let propertiesAsMap = null;

  if (properties) {
    propertiesAsMap = {};
    for (const prop of properties) {
      if (prop && prop.length > 0 && !prop.startsWith('#')) {
        const keyValue = prop.split('=');
        if (keyValue.length === 2) {
          propertiesAsMap[keyValue[0]] = keyValue[1];
        } else {
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
