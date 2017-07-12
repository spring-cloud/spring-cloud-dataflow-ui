import { FormControl } from '@angular/forms';

export function validateDeploymentProperties(c: FormControl) {
  var properties = c.value.split('\n');
  var propertiesAsMap = null;

  if (properties) {
    propertiesAsMap = {};
    for (let prop of properties) {
      if (prop && prop.length > 0 && !prop.startsWith('#')) {
        var keyValue = prop.split('=');
        if (keyValue.length===2) {
          propertiesAsMap[keyValue[0]] = keyValue[1];
        }
        else {
          return {validateDeploymentProperties: {reason: 'Invalid deployment property "' + prop +'" must contain a single "=".' }};
        }
      }
    }
  }
  return null;
}
